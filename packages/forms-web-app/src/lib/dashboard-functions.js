const {
	mapDecisionColour,
	mapDecisionLabel
} = require('@pins/business-rules/src/utils/decision-outcome');

const {
	formatAddress,
	isAppealSubmission,
	isV2Submission
} = require('@pins/common/src/lib/format-address');
const { formatDateForDisplay } = require('@pins/common/src/lib/format-date');
const { caseTypeNameWithDefault } = require('@pins/common/src/lib/format-case-type');
const {
	APPEAL_USER_ROLES,
	REPRESENTATION_TYPES,
	LPA_USER_ROLE
} = require('@pins/common/src/constants');
const { deadlineHasPassed } = require('./deadline-has-passed');
const logger = require('#lib/logger');

/**
 * @typedef {import('@pins/common/src/constants').AppealToUserRoles | "LPAUser" | null} UserRole
 * @typedef {import('appeals-service-api').Api.AppealCaseDetailed} AppealCaseDetailed
 * @typedef {import('appeals-service-api').Api.AppealSubmission} AppealSubmission
 * @typedef {import('appeals-service-api').Api.Representation} Representation
 */

/**
 * @typedef DashboardDisplayData
 * @type {object}
 * @property {string} [appealId] the uuid of the appeal in our db
 * @property {string} appealNumber the caseReference for the appeal
 * @property {string} address the address of the site subject to the appeal
 * @property {string | undefined | null} appealType the type of appeal
 * @property {DueJourneyType} nextJourneyDue object with details of the next journey due
 * @property {boolean} [isNewAppeal] whether this is a new appeal
 * @property {boolean} [isDraft] whether the appeal submission is in draft state
 * @property {boolean} [displayInvalid] whether an invalidated appeal should be invalidated
 * @property {string | undefined | null} appealDecision the PINS decision in respect of the appeal
 * @property {string | null} [appealDecisionColor] tag color to use for the decision
 * @property {string | undefined | null} caseDecisionOutcomeDate
 * @property {{ appealType: string | undefined, appealId: string | undefined }} [continueParams]
 */

/**
 * @typedef DueJourneyType
 * @type {object}
 * @property {string | Date | null} [deadline] the date by which the journey is due
 * @property {number | null} [dueInDays] the number of days remaining until the deadline expires
 * @property {string | null} journeyDue the type of journey which is due next
 * @property {string | null} [baseUrl] the base url for the journey type
 */

const { calculateDueInDays } = require('./calculate-due-in-days');

const {
	getAppealTypeName,
	getAppealTypeNameByTypeCode
} = require('./full-appeal/map-planning-application');
const { mapTypeCodeToAppealId } = require('@pins/common');
const { businessRulesDeadline } = require('./calculate-deadline');
const { APPEAL_CASE_STATUS, APPEAL_REPRESENTATION_STATUS } = require('pins-data-model');
const { calculateDaysSinceInvalidated } = require('./calculate-days-since-invalidated');

const questionnaireBaseUrl = '/manage-appeals/questionnaire';
const statementBaseUrl = '/manage-appeals/appeal-statement';
const finalCommentBaseUrl = '/manage-appeals/final-comments';
const proofsBaseUrl = '/manage-appeals/proof-evidence';

const appellantFinalCommentBaseUrl = '/appeals/final-comments';
const appellantProofsBaseUrl = '/appeals/proof-evidence';

const rule6StatementBaseUrl = '/rule-6/appeal-statement';
const rule6ProofsBaseUrl = '/rule-6/proof-evidence';

const INVALID_APPEAL_TIME_LIMIT = 28;

// MAP DATABASE RETURN OBJECTS TO DASHBOARD DISPLAY DATA

/**
 * @param {AppealCaseDetailed} appealCaseData
 * @returns {DashboardDisplayData}
 */
const mapToLPADashboardDisplayData = (appealCaseData) => ({
	appealNumber: appealCaseData.caseReference,
	address: formatAddress(appealCaseData),
	appealType: appealCaseData.appealTypeCode,
	nextJourneyDue: determineJourneyToDisplayLPADashboard(appealCaseData),
	isNewAppeal: isNewAppeal(appealCaseData),
	displayInvalid: displayInvalidAppeal(appealCaseData),
	appealDecision: mapDecisionLabel(appealCaseData.caseDecisionOutcome),
	appealDecisionColor: mapDecisionColour(appealCaseData.caseDecisionOutcome),
	caseDecisionOutcomeDate: formatDateForDisplay(appealCaseData.caseDecisionOutcomeDate)
});

/**
 * @param {AppealSubmission | AppealCaseDetailed} appealData
 * @returns {DashboardDisplayData|null}
 */
const mapToAppellantDashboardDisplayData = (appealData) => {
	const id = isAppealSubmission(appealData) ? appealData._id : appealData.id;
	try {
		return {
			appealId: id,
			appealNumber:
				isAppealSubmission(appealData) || isV2Submission(appealData)
					? ''
					: appealData.caseReference,
			address: formatAddress(appealData),
			appealType: getAppealType(appealData),
			nextJourneyDue: determineJourneyToDisplayAppellantDashboard(appealData),
			isDraft: isAppealSubmission(appealData) || isV2Submission(appealData),
			displayInvalid: displayInvalidAppeal(appealData),
			appealDecision: isAppealSubmission(appealData)
				? null
				: mapDecisionLabel(appealData.caseDecisionOutcome),
			appealDecisionColor:
				isAppealSubmission(appealData) || isV2Submission(appealData)
					? null
					: mapDecisionColour(appealData.caseDecisionOutcome),
			caseDecisionOutcomeDate:
				isAppealSubmission(appealData) || isV2Submission(appealData)
					? null
					: appealData.caseDecisionOutcomeDate
		};
	} catch (err) {
		logger.error({ err }, `failed to mapToAppellantDashboardDisplayData ${id}`);
	}

	return null;
};

/**
 * @param {AppealCaseDetailed} appealCaseData
 * @returns {DashboardDisplayData}
 */
const mapToRule6DashboardDisplayData = (appealCaseData) => ({
	appealNumber: appealCaseData.caseReference,
	address: formatAddress(appealCaseData),
	appealType: appealCaseData.appealTypeCode,
	nextJourneyDue: determineJourneyToDisplayRule6Dashboard(appealCaseData),
	appealDecision: mapDecisionLabel(appealCaseData.caseDecisionOutcome),
	appealDecisionColor: mapDecisionColour(appealCaseData.caseDecisionOutcome),
	caseDecisionOutcomeDate: formatDateForDisplay(appealCaseData.caseDecisionOutcomeDate)
});

// LPADashboard - ToDo or WaitingToReview FUNCTIONS

/**
 * @param {DashboardDisplayData} dashboardData
 * @returns {boolean}
 */
const isToDoLPADashboard = (dashboardData) => {
	return (
		dashboardData.isNewAppeal ||
		dashboardData.displayInvalid ||
		displayJourneyOnToDo(dashboardData.nextJourneyDue)
	);
};

/**
 * @param {DueJourneyType} dueJourney
 * @returns {boolean}
 */
const displayJourneyOnToDo = (dueJourney) => {
	return !!dueJourney.journeyDue && !overdueJourneyNotToBeDisplayed(dueJourney);
};

/**
 * @param {DueJourneyType} dueJourney
 * @returns {boolean}
 */
const overdueJourneyNotToBeDisplayed = (dueJourney) => {
	return !!(
		dueJourney.dueInDays &&
		dueJourney.dueInDays < 0 &&
		dueJourney.journeyDue !== 'Questionnaire'
	);
};

/**
 * @param {DashboardDisplayData} dashboardData
 * @returns {boolean}
 */
const isToDoAppellantDashboard = (dashboardData) => {
	return dashboardData.displayInvalid || displayJourneyOnToDo(dashboardData.nextJourneyDue);
};

/**
 * @param {DashboardDisplayData} dashboardData
 * @returns {boolean}
 */
const isToDoRule6Dashboard = (dashboardData) => {
	return displayJourneyOnToDo(dashboardData.nextJourneyDue);
};

/**
 * @param {AppealSubmission} appealSubmission
 * @returns {Date|object|undefined} returns appeal deadline - note: should return Date as rawDate param set as true
 */
const calculateAppealDueDeadline = (appealSubmission) => {
	if (isAppealSubmission(appealSubmission)) {
		return businessRulesDeadline(
			appealSubmission.appeal?.decisionDate,
			appealSubmission.appeal?.appealType,
			null,
			true
		);
	} else if (isV2Submission(appealSubmission)) {
		return businessRulesDeadline(
			appealSubmission?.AppellantSubmission?.applicationDecisionDate,
			mapTypeCodeToAppealId(appealSubmission.AppellantSubmission.appealTypeCode),
			null,
			true
		);
	}
};

/**
 * @param {AppealCaseDetailed} appealCaseData
 * @returns {boolean} returns depending on whether a Questionnaire due date has been set
 */
const isNewAppeal = (appealCaseData) => {
	return !appealCaseData.lpaQuestionnaireDueDate;
};

/**
 * @param {AppealCaseDetailed} appealCaseData
 * @returns {DueJourneyType} object containing details of next due journey
 */
const determineJourneyToDisplayLPADashboard = (appealCaseData) => {
	if (displayInvalidAppeal(appealCaseData)) {
		return {
			deadline: null,
			/// ensures invalid appeals appear at the top of the of the display
			dueInDays: -100000,
			journeyDue: null
		};
	} else if (isQuestionnaireDue(appealCaseData)) {
		return {
			deadline: appealCaseData.lpaQuestionnaireDueDate,
			dueInDays: calculateDueInDays(appealCaseData.lpaQuestionnaireDueDate),
			journeyDue: 'Questionnaire',
			baseUrl: `${questionnaireBaseUrl}/${appealCaseData.caseReference}`
		};
	} else if (
		isLPAStatementDue(appealCaseData) &&
		!(calculateDueInDays(appealCaseData.statementDueDate) < 0)
	) {
		return {
			deadline: appealCaseData.statementDueDate,
			dueInDays: calculateDueInDays(appealCaseData.statementDueDate),
			journeyDue: 'Statement',
			// direct straight to first question of statement journey
			baseUrl: `${statementBaseUrl}/${appealCaseData.caseReference}/appeal-statement`
		};
	} else if (isLPAFinalCommentDue(appealCaseData)) {
		return {
			deadline: appealCaseData.finalCommentsDueDate,
			dueInDays: calculateDueInDays(appealCaseData.finalCommentsDueDate),
			journeyDue: 'Final comment',
			baseUrl: `${finalCommentBaseUrl}/${appealCaseData.caseReference}`
		};
	} else if (isLPAProofsOfEvidenceDue(appealCaseData)) {
		return {
			deadline: appealCaseData.proofsOfEvidenceDueDate,
			dueInDays: calculateDueInDays(appealCaseData.proofsOfEvidenceDueDate),
			journeyDue: 'Proofs of Evidence',
			baseUrl: `${proofsBaseUrl}/${appealCaseData.caseReference}`
		};
	}

	return {
		deadline: null,
		dueInDays: 100000,
		journeyDue: null,
		baseUrl: null
	};
};

/**
 * @param {AppealCaseDetailed | AppealSubmission} caseOrSubmission
 * @returns {DueJourneyType} object containing details of next due journey
 */
const determineJourneyToDisplayAppellantDashboard = (caseOrSubmission) => {
	if (isAppealSubmission(caseOrSubmission)) {
		const deadline = calculateAppealDueDeadline(caseOrSubmission);
		return {
			deadline,
			dueInDays: calculateDueInDays(deadline),
			journeyDue: 'Continue'
		};
	} else if (isV2Submission(caseOrSubmission)) {
		const deadline = calculateAppealDueDeadline(caseOrSubmission);
		return {
			deadline,
			dueInDays: calculateDueInDays(deadline),
			journeyDue: 'Continue'
		};
	} else if (displayInvalidAppeal(caseOrSubmission)) {
		return {
			deadline: null,
			/// ensures invalid appeals appear at the top of the of the display
			dueInDays: -100000,
			journeyDue: 'Invalid'
		};
	} else if (isAppellantFinalCommentDue(caseOrSubmission)) {
		return {
			deadline: caseOrSubmission.finalCommentsDueDate,
			dueInDays: calculateDueInDays(caseOrSubmission.finalCommentsDueDate),
			journeyDue: 'Final comments',
			baseUrl: `${appellantFinalCommentBaseUrl}/${caseOrSubmission.caseReference}`
		};
	} else if (isAppellantProofsOfEvidenceDue(caseOrSubmission)) {
		return {
			deadline: caseOrSubmission.proofsOfEvidenceDueDate,
			dueInDays: calculateDueInDays(caseOrSubmission.proofsOfEvidenceDueDate),
			journeyDue: 'Proofs of evidence',
			baseUrl: `${appellantProofsBaseUrl}/${caseOrSubmission.caseReference}`
		};
	}

	return {
		deadline: null,
		dueInDays: 100000,
		journeyDue: null,
		baseUrl: null
	};
};

/**
 * @param {AppealCaseDetailed} appealCaseData
 * @returns {DueJourneyType} object containing details of next due journey
 */
const determineJourneyToDisplayRule6Dashboard = (appealCaseData) => {
	if (isRule6StatementDue(appealCaseData)) {
		return {
			deadline: appealCaseData.statementDueDate,
			dueInDays: calculateDueInDays(appealCaseData.statementDueDate),
			journeyDue: 'Statement',
			baseUrl: `${rule6StatementBaseUrl}/${appealCaseData.caseReference}`
		};
	} else if (isRule6ProofOfEvidenceDue(appealCaseData)) {
		return {
			deadline: appealCaseData.proofsOfEvidenceDueDate,
			dueInDays: calculateDueInDays(appealCaseData.proofsOfEvidenceDueDate),
			journeyDue: 'Proof of Evidence',
			baseUrl: `${rule6ProofsBaseUrl}/${appealCaseData.caseReference}`
		};
	}

	return {
		deadline: null,
		dueInDays: 100000,
		journeyDue: null,
		baseUrl: null
	};
};

// Helper functions, not exported, potential for refactoring as repetitive

/**
 * @param {AppealCaseDetailed} appealCaseData
 * @returns {boolean}
 */
const isQuestionnaireDue = (appealCaseData) => {
	return (
		!!appealCaseData.lpaQuestionnaireDueDate &&
		!appealCaseData.lpaQuestionnaireSubmittedDate &&
		appealCaseData.caseStatus === APPEAL_CASE_STATUS.LPA_QUESTIONNAIRE
	);
};

/**
 * @param {AppealCaseDetailed} caseData
 * @param {UserRole} userType
 * @returns {boolean}
 */
const shouldDisplayQuestionnaireDueNotification = (caseData, userType) =>
	userType === LPA_USER_ROLE &&
	!caseData.lpaQuestionnaireSubmittedDate &&
	!!caseData.lpaQuestionnaireDueDate;

/**
 * @param {AppealCaseDetailed} appealCaseData
 * @returns {boolean}
 */
const isLPAStatementDue = (appealCaseData) => {
	return (
		!!appealCaseData.statementDueDate &&
		!appealCaseData.LPAStatementSubmittedDate &&
		appealCaseData.caseStatus === APPEAL_CASE_STATUS.STATEMENTS
	);
};

/**
 * @param {AppealCaseDetailed} caseData
 * @returns {boolean}
 */
const isLpaStatementOpen = (caseData) => {
	return (
		deadlineHasPassed(caseData.lpaQuestionnaireDueDate) ||
		caseData.caseStatus === APPEAL_CASE_STATUS.STATEMENTS
	);
};

/**
 * @param {AppealCaseDetailed} caseData
 * @param {UserRole} userType
 * @returns {boolean}
 */
const shouldDisplayStatementsDueBannerLPA = (caseData, userType) => {
	return (
		!!caseData.statementDueDate &&
		userType === LPA_USER_ROLE &&
		deadlineHasPassed(caseData.lpaQuestionnaireDueDate) &&
		!caseData.LPAStatementSubmittedDate &&
		!deadlineHasPassed(caseData.statementDueDate)
	);
};

/**
 * @param {AppealCaseDetailed} appealCaseData
 * @returns {boolean}
 */
const isLPAFinalCommentDue = (appealCaseData) => {
	return (
		!!appealCaseData.finalCommentsDueDate &&
		!appealCaseData.LPACommentsSubmittedDate &&
		appealCaseData.caseStatus === APPEAL_CASE_STATUS.FINAL_COMMENTS
	);
};

/**
 * @param {AppealCaseDetailed} caseData
 * @param {UserRole} userType
 * @returns {boolean}
 */
const shouldDisplayFinalCommentsDueBannerLPA = (caseData, userType) => {
	return (
		!!caseData.finalCommentsDueDate &&
		userType === LPA_USER_ROLE &&
		deadlineHasPassed(caseData.statementDueDate) &&
		deadlineHasPassed(caseData.interestedPartyRepsDueDate) &&
		!deadlineHasPassed(caseData.finalCommentsDueDate) &&
		!caseData.LPACommentsSubmittedDate
	);
};

/**
 * @param {AppealCaseDetailed} appealCaseData
 * @returns {boolean}
 */
const isLPAProofsOfEvidenceDue = (appealCaseData) => {
	return (
		!!appealCaseData.proofsOfEvidenceDueDate &&
		!appealCaseData.LPAProofsSubmittedDate &&
		appealCaseData.caseStatus === APPEAL_CASE_STATUS.EVIDENCE
	);
};

/**
 * @param {AppealCaseDetailed} caseData
 * @param {UserRole} userType
 * @returns {boolean}
 */
const shouldDisplayProofEvidenceDueBannerLPA = (caseData, userType) => {
	return (
		!!caseData.proofsOfEvidenceDueDate &&
		userType === LPA_USER_ROLE &&
		deadlineHasPassed(caseData.statementDueDate) &&
		deadlineHasPassed(caseData.interestedPartyRepsDueDate) &&
		deadlineHasPassed(caseData.finalCommentsDueDate) &&
		!deadlineHasPassed(caseData.proofsOfEvidenceDueDate) &&
		!caseData.LPAProofsSubmittedDate
	);
};

/**
 * @param {AppealCaseDetailed} appealCaseData
 * @returns {boolean}
 */
const isAppellantFinalCommentDue = (appealCaseData) => {
	return (
		!!appealCaseData.finalCommentsDueDate &&
		!appealCaseData.appellantCommentsSubmittedDate &&
		appealCaseData.caseStatus === APPEAL_CASE_STATUS.FINAL_COMMENTS
	);
};

/**
 * @param {AppealCaseDetailed} caseData
 * @param {UserRole} userType
 * @returns {boolean}
 */
const shouldDisplayFinalCommentsDueBannerAppellant = (caseData, userType) => {
	return (
		!!caseData.finalCommentsDueDate &&
		userType === APPEAL_USER_ROLES.APPELLANT &&
		deadlineHasPassed(caseData.statementDueDate) &&
		deadlineHasPassed(caseData.interestedPartyRepsDueDate) &&
		!deadlineHasPassed(caseData.finalCommentsDueDate) &&
		!caseData.appellantCommentsSubmittedDate
	);
};

/**
 * @param {AppealCaseDetailed} appealCaseData
 * @returns {boolean}
 */
const isAppellantProofsOfEvidenceDue = (appealCaseData) => {
	return (
		!!appealCaseData.proofsOfEvidenceDueDate &&
		!appealCaseData.appellantProofsSubmittedDate &&
		appealCaseData.caseStatus === APPEAL_CASE_STATUS.EVIDENCE
	);
};

/**
 * @param {AppealCaseDetailed} caseData
 * @param {UserRole} userType
 * @returns {boolean}
 */
const shouldDisplayProofEvidenceDueBannerAppellant = (caseData, userType) => {
	return (
		!!caseData.proofsOfEvidenceDueDate &&
		userType === APPEAL_USER_ROLES.APPELLANT &&
		deadlineHasPassed(caseData.statementDueDate) &&
		deadlineHasPassed(caseData.interestedPartyRepsDueDate) &&
		deadlineHasPassed(caseData.finalCommentsDueDate) &&
		!deadlineHasPassed(caseData.proofsOfEvidenceDueDate) &&
		!caseData.appellantProofsSubmittedDate
	);
};

/**
 * @param {Representation[]|undefined} representations
 * @param {string} type
 * @param {boolean} owned
 * @returns {boolean}
 */
const representationExists = (representations, type, owned) => {
	return !!representations?.filter(
		(rep) => (!owned || rep.userOwnsRepresentation) && rep.representationType === type
	).length;
};

/**
 * Find other user's representations by type, must be published
 * @param {Representation[]|undefined} representations
 * @param {string} type
 * @param {import('@pins/common/src/constants').LpaUserRole|import('@pins/common/src/constants').AppealToUserRoles} [submitter]
 * @returns {boolean}
 */
const representationPublished = (representations, type, submitter) => {
	/**
	 * @param {Representation} rep
	 * @returns {boolean}
	 */
	function isSubmitter(rep) {
		if (!submitter) return true;

		// appellant and agent treated as the same
		if (submitter === APPEAL_USER_ROLES.APPELLANT || submitter === APPEAL_USER_ROLES.AGENT)
			return (
				rep.submittingPartyType === APPEAL_USER_ROLES.APPELLANT ||
				rep.submittingPartyType === APPEAL_USER_ROLES.AGENT
			);

		return rep.submittingPartyType === submitter;
	}

	return !!representations?.filter(
		(rep) =>
			rep.representationStatus === APPEAL_REPRESENTATION_STATUS.PUBLISHED && // published
			!rep.userOwnsRepresentation && // not owned
			rep.representationType === type && // matches type
			isSubmitter(rep)
	).length; // if present checks the submittingPartyType matches
};

/**
 * @param {AppealCaseDetailed} appealCaseData
 * @returns {boolean}
 */
const isRule6StatementDue = (appealCaseData) => {
	return (
		!!appealCaseData.statementDueDate &&
		!representationExists(appealCaseData.Representations, REPRESENTATION_TYPES.STATEMENT, true) &&
		appealCaseData.caseStatus === APPEAL_CASE_STATUS.STATEMENTS
	);
};

/**
 * @param {AppealCaseDetailed} caseData
 * @param {UserRole} userType
 * @returns {boolean}
 */
const shouldDisplayStatementsDueBannerRule6 = (caseData, userType) => {
	return (
		!!caseData.statementDueDate &&
		userType === APPEAL_USER_ROLES.RULE_6_PARTY &&
		!!caseData.lpaQuestionnairePublishedDate &&
		!representationExists(caseData.Representations, REPRESENTATION_TYPES.STATEMENT, true) &&
		!deadlineHasPassed(caseData.statementDueDate)
	);
};

/**
 * @param {AppealCaseDetailed} appealCaseData
 * @returns {boolean}
 */
const isRule6ProofOfEvidenceDue = (appealCaseData) => {
	return (
		!!appealCaseData.proofsOfEvidenceDueDate &&
		!representationExists(
			appealCaseData.Representations,
			REPRESENTATION_TYPES.PROOFS_OF_EVIDENCE,
			true
		) &&
		appealCaseData.caseStatus === APPEAL_CASE_STATUS.EVIDENCE
	);
};

/**
 * @param {AppealCaseDetailed} caseData
 * @param {UserRole} userType
 * @returns {boolean}
 */
const shouldDisplayProofEvidenceDueBannerRule6 = (caseData, userType) => {
	return (
		!!caseData.proofsOfEvidenceDueDate &&
		userType === APPEAL_USER_ROLES.RULE_6_PARTY &&
		deadlineHasPassed(caseData.statementDueDate) &&
		deadlineHasPassed(caseData.interestedPartyRepsDueDate) &&
		deadlineHasPassed(caseData.finalCommentsDueDate) &&
		!deadlineHasPassed(caseData.proofsOfEvidenceDueDate) &&
		!representationExists(caseData.Representations, REPRESENTATION_TYPES.PROOFS_OF_EVIDENCE, true)
	);
};

/**
 * @param {AppealCaseDetailed} appealCaseData
 * @returns {boolean}
 */
const displayInvalidAppeal = (appealCaseData) => {
	if (appealCaseData.caseStatus === APPEAL_CASE_STATUS.INVALID) {
		return (
			calculateDaysSinceInvalidated(appealCaseData.caseValidationDate) < INVALID_APPEAL_TIME_LIMIT
		);
	}

	return false;
};

/**
 * @param {AppealCaseDetailed | AppealSubmission} appealCaseData
 * @returns {string}
 */
const getAppealType = (appealCaseData) => {
	if (isAppealSubmission(appealCaseData)) {
		return getAppealTypeName(appealCaseData.appeal?.appealType);
	}
	if (isV2Submission(appealCaseData)) {
		return getAppealTypeNameByTypeCode(appealCaseData?.AppellantSubmission?.appealTypeCode);
	}

	const caseType = caseTypeNameWithDefault(appealCaseData?.appealTypeCode);
	return `${caseType} appeal`;
};

module.exports = {
	formatAddress,
	isNewAppeal,
	determineJourneyToDisplayLPADashboard,
	determineJourneyToDisplayRule6Dashboard,
	mapToLPADashboardDisplayData,
	isToDoLPADashboard,
	isToDoAppellantDashboard,
	mapToAppellantDashboardDisplayData,
	mapToRule6DashboardDisplayData,
	isToDoRule6Dashboard,
	representationExists,
	representationPublished,
	shouldDisplayQuestionnaireDueNotification,
	shouldDisplayStatementsDueBannerLPA,
	isLpaStatementOpen,
	shouldDisplayStatementsDueBannerRule6,
	shouldDisplayFinalCommentsDueBannerLPA,
	shouldDisplayFinalCommentsDueBannerAppellant,
	shouldDisplayProofEvidenceDueBannerAppellant,
	shouldDisplayProofEvidenceDueBannerLPA,
	shouldDisplayProofEvidenceDueBannerRule6
};
