const {
	mapDecisionColour,
	mapDecisionLabel
} = require('@pins/business-rules/src/utils/decision-outcome');
const {
	formatDashboardLinkedCaseDetails,
	isChildLinkedAppeal
} = require('@pins/common/src/lib/linked-appeals');
const {
	isNewAppealForLPA,
	isLPAQuestionnaireDue,
	isLPAStatementOpen,
	isRule6StatementOpen,
	isAppellantProofsOfEvidenceOpen,
	isLPAProofsOfEvidenceOpen,
	isRule6ProofsOfEvidenceOpen,
	isAppellantFinalCommentOpen,
	isLPAFinalCommentOpen
} = require('@pins/business-rules/src/rules/appeal-case/case-due-dates');
const { SUBMISSIONS } = require('@pins/common/src/constants');
const {
	formatAddress,
	isAppealSubmission,
	isV2Submission
} = require('@pins/common/src/lib/format-address');
const { formatDateForDisplay } = require('@pins/common/src/lib/format-date');
const { caseTypeNameWithDefault } = require('@pins/common/src/lib/format-case-type');
const logger = require('#lib/logger');
const escape = require('escape-html');

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
 * @property {LinkedCaseDetails | null} linkedCaseDetails if appeal is linked, including linked role ie 'lead', 'child'
 * @property {boolean} [displayNextJourneyLink] whether the next journey link should be displayed
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

/**
 * @typedef LinkedCaseDetails
 * @type {object}
 * @property {string | null} linkedCaseStatus
 * @property {string | null | undefined} leadCaseReference
 * @property {string | null | undefined} linkedCaseStatusLabel
 */

const { calculateDueInDays } = require('@pins/common/src/lib/calculate-due-in-days');

const { getAppealTypeName } = require('./full-appeal/map-planning-application');
const { businessRulesDeadline, getDeadlineV2 } = require('./calculate-deadline');
const {
	APPEAL_CASE_STATUS,
	APPEAL_LINKED_CASE_STATUS
} = require('@planning-inspectorate/data-model');
const { calculateDaysSinceInvalidated } = require('./calculate-days-since-invalidated');
const { APPEAL_USER_ROLES, LPA_USER_ROLE } = require('@pins/common/src/constants');
const { formatGridReference } = require('@pins/common/src/lib/format-grid-reference');

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
const mapToLPADashboardDisplayData = (appealCaseData) => {
	const address = appealCaseData.siteAddressLine1
		? formatAddress(appealCaseData)
		: formatGridReference(
				appealCaseData.siteGridReferenceEasting,
				appealCaseData.siteGridReferenceNorthing
			);

	const escapedAddress = escape(address);
	return {
		appealNumber: appealCaseData.caseReference,
		address: escapedAddress.replace(/\n/g, '<br>'),
		appealType: getAppealType(appealCaseData),
		nextJourneyDue: determineJourneyToDisplayLPADashboard(appealCaseData),
		isNewAppeal: isNewAppealForLPA(appealCaseData),
		displayInvalid: displayInvalidAppeal(appealCaseData),
		appealDecision: mapDecisionLabel(appealCaseData.caseDecisionOutcome),
		appealDecisionColor: mapDecisionColour(appealCaseData.caseDecisionOutcome),
		caseDecisionOutcomeDate: formatDateForDisplay(appealCaseData.caseDecisionOutcomeDate),
		linkedCaseDetails: formatDashboardLinkedCaseDetails(appealCaseData),
		displayNextJourneyLink: displayNextJourneyLink(appealCaseData, LPA_USER_ROLE)
	};
};

/**
 * @param {AppealSubmission | AppealCaseDetailed} appealData
 * @returns {DashboardDisplayData|null}
 */
const mapToAppellantDashboardDisplayData = (appealData) => {
	const id = isAppealSubmission(appealData) ? appealData._id : appealData.id;

	const address = appealData.siteAddressLine1
		? formatAddress(appealData)
		: formatGridReference(
				appealData.siteGridReferenceEasting,
				appealData.siteGridReferenceNorthing
			);

	const escapedAddress = escape(address);

	try {
		return {
			appealId: id,
			appealNumber:
				isAppealSubmission(appealData) || isV2Submission(appealData)
					? ''
					: appealData.caseReference,
			address: escapedAddress.replace(/\n/g, '<br>'),
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
					: appealData.caseDecisionOutcomeDate,
			linkedCaseDetails: isAppealSubmission(appealData)
				? null
				: formatDashboardLinkedCaseDetails(appealData),
			displayNextJourneyLink: isAppealSubmission(appealData)
				? true
				: displayNextJourneyLink(appealData, APPEAL_USER_ROLES.APPELLANT)
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
const mapToRule6DashboardDisplayData = (appealCaseData) => {
	const address = appealCaseData.siteAddressLine1
		? formatAddress(appealCaseData)
		: formatGridReference(
				appealCaseData.siteGridReferenceEasting,
				appealCaseData.siteGridReferenceNorthing
			);

	const escapedAddress = escape(address);

	return {
		appealNumber: appealCaseData.caseReference,
		address: escapedAddress.replace(/\n/g, '<br>'),
		appealType: getAppealType(appealCaseData),
		nextJourneyDue: determineJourneyToDisplayRule6Dashboard(appealCaseData),
		appealDecision: mapDecisionLabel(appealCaseData.caseDecisionOutcome),
		appealDecisionColor: mapDecisionColour(appealCaseData.caseDecisionOutcome),
		caseDecisionOutcomeDate: formatDateForDisplay(appealCaseData.caseDecisionOutcomeDate),
		linkedCaseDetails: formatDashboardLinkedCaseDetails(appealCaseData)
	};
};

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
		dueJourney.journeyDue !== SUBMISSIONS.QUESTIONNAIRE
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
		return getDeadlineV2(
			appealSubmission.AppellantSubmission.appealTypeCode,
			appealSubmission.AppellantSubmission.enforcementEffectiveDate,
			appealSubmission.AppellantSubmission.applicationDecisionDate
		);
	}
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
	} else if (isLPAQuestionnaireDue(appealCaseData)) {
		return {
			deadline: appealCaseData.lpaQuestionnaireDueDate,
			dueInDays: calculateDueInDays(appealCaseData.lpaQuestionnaireDueDate),
			journeyDue: SUBMISSIONS.QUESTIONNAIRE,
			baseUrl: `${questionnaireBaseUrl}/${appealCaseData.caseReference}`
		};
	} else if (isLPAStatementOpen(appealCaseData)) {
		return {
			deadline: appealCaseData.statementDueDate,
			dueInDays: calculateDueInDays(appealCaseData.statementDueDate),
			journeyDue: SUBMISSIONS.STATEMENT,
			baseUrl: `${statementBaseUrl}/${appealCaseData.caseReference}/entry`
		};
	} else if (isLPAFinalCommentOpen(appealCaseData)) {
		return {
			deadline: appealCaseData.finalCommentsDueDate,
			dueInDays: calculateDueInDays(appealCaseData.finalCommentsDueDate),
			journeyDue: SUBMISSIONS.FINAL_COMMENT,
			baseUrl: `${finalCommentBaseUrl}/${appealCaseData.caseReference}/entry`
		};
	} else if (isLPAProofsOfEvidenceOpen(appealCaseData)) {
		return {
			deadline: appealCaseData.proofsOfEvidenceDueDate,
			dueInDays: calculateDueInDays(appealCaseData.proofsOfEvidenceDueDate),
			journeyDue: SUBMISSIONS.PROOFS_EVIDENCE,
			baseUrl: `${proofsBaseUrl}/${appealCaseData.caseReference}/entry`
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
			journeyDue: SUBMISSIONS.CONTINUE
		};
	} else if (isV2Submission(caseOrSubmission)) {
		const deadline = calculateAppealDueDeadline(caseOrSubmission);
		return {
			deadline,
			dueInDays: calculateDueInDays(deadline),
			journeyDue: SUBMISSIONS.CONTINUE
		};
	} else if (displayInvalidAppeal(caseOrSubmission)) {
		return {
			deadline: null,
			/// ensures invalid appeals appear at the top of the of the display
			dueInDays: -100000,
			journeyDue: SUBMISSIONS.INVALID
		};
	} else if (isAppellantFinalCommentOpen(caseOrSubmission)) {
		return {
			deadline: caseOrSubmission.finalCommentsDueDate,
			dueInDays: calculateDueInDays(caseOrSubmission.finalCommentsDueDate),
			journeyDue: SUBMISSIONS.FINAL_COMMENT,
			baseUrl: `${appellantFinalCommentBaseUrl}/${caseOrSubmission.caseReference}/entry`
		};
	} else if (isAppellantProofsOfEvidenceOpen(caseOrSubmission)) {
		return {
			deadline: caseOrSubmission.proofsOfEvidenceDueDate,
			dueInDays: calculateDueInDays(caseOrSubmission.proofsOfEvidenceDueDate),
			journeyDue: SUBMISSIONS.PROOFS_EVIDENCE,
			baseUrl: `${appellantProofsBaseUrl}/${caseOrSubmission.caseReference}/entry`
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
	if (isRule6StatementOpen(appealCaseData)) {
		return {
			deadline: appealCaseData.statementDueDate,
			dueInDays: calculateDueInDays(appealCaseData.statementDueDate),
			journeyDue: SUBMISSIONS.STATEMENT,
			baseUrl: `${rule6StatementBaseUrl}/${appealCaseData.caseReference}/entry`
		};
	} else if (isRule6ProofsOfEvidenceOpen(appealCaseData)) {
		return {
			deadline: appealCaseData.proofsOfEvidenceDueDate,
			dueInDays: calculateDueInDays(appealCaseData.proofsOfEvidenceDueDate),
			journeyDue: SUBMISSIONS.PROOFS_EVIDENCE,
			baseUrl: `${rule6ProofsBaseUrl}/${appealCaseData.caseReference}/entry`
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
 * @param {DashboardDisplayData[]} displayDataArray
 * @returns {DashboardDisplayData[]}
 */
const updateChildAppealDisplayData = (displayDataArray) => {
	const leadCases = displayDataArray.filter(
		(caseData) => caseData.linkedCaseDetails?.linkedCaseStatus === APPEAL_LINKED_CASE_STATUS.LEAD
	);

	if (!leadCases.length) return displayDataArray;

	return displayDataArray.map((caseData) => {
		if (
			caseData.linkedCaseDetails?.linkedCaseStatus === APPEAL_LINKED_CASE_STATUS.CHILD &&
			caseData.nextJourneyDue.journeyDue !== SUBMISSIONS.QUESTIONNAIRE
		) {
			return {
				...caseData,
				nextJourneyDue:
					leadCases.find(
						(leadCase) => leadCase.appealNumber === caseData.linkedCaseDetails?.leadCaseReference
					)?.nextJourneyDue || caseData.nextJourneyDue
			};
		}
		return caseData;
	});
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
 * @param {AppealCaseDetailed} appealCaseData
 * @param {UserRole} userRole
 * @returns {boolean}
 */
const displayNextJourneyLink = (appealCaseData, userRole) => {
	if (!isChildLinkedAppeal(appealCaseData)) return true;

	switch (userRole) {
		case APPEAL_USER_ROLES.APPELLANT:
			return (
				isV2Submission(appealCaseData) ||
				displayInvalidAppeal(appealCaseData) ||
				isAppellantFinalCommentOpen(appealCaseData) ||
				isAppellantProofsOfEvidenceOpen(appealCaseData)
			);
		case LPA_USER_ROLE:
			return (
				displayInvalidAppeal(appealCaseData) ||
				isLPAQuestionnaireDue(appealCaseData) ||
				isLPAStatementOpen(appealCaseData) ||
				isLPAFinalCommentOpen(appealCaseData) ||
				isLPAProofsOfEvidenceOpen(appealCaseData)
			);
		default:
			return true;
	}
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
		return caseTypeNameWithDefault(appealCaseData?.AppellantSubmission?.appealTypeCode);
	}

	return caseTypeNameWithDefault(appealCaseData?.appealTypeCode);
};

module.exports = {
	formatAddress,
	determineJourneyToDisplayLPADashboard,
	determineJourneyToDisplayRule6Dashboard,
	mapToLPADashboardDisplayData,
	isToDoLPADashboard,
	isToDoAppellantDashboard,
	mapToAppellantDashboardDisplayData,
	mapToRule6DashboardDisplayData,
	isToDoRule6Dashboard,
	updateChildAppealDisplayData
};
