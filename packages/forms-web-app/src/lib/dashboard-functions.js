const {
	mapDecisionColour,
	mapDecisionLabel
} = require('@pins/business-rules/src/utils/decision-outcome');

const {
	formatAddress,
	isAppealSubmission,
	isV2Submission
} = require('@pins/common/src/lib/format-address');
const { formatDate } = require('#utils/format-date');
const { caseTypeNameWithDefault } = require('@pins/common/src/lib/format-case-type');
const logger = require('#lib/logger');

/**
 * @typedef {import('appeals-service-api').Api.AppealCaseDetailed} AppealCaseDetailed
 * @typedef {import('appeals-service-api').Api.AppealSubmission} AppealSubmission
 */

/**
 * @typedef DashboardDisplayData
 * @type {object}
 * @property {string} [appealId] the uuid of the appeal in our db
 * @property {string} appealNumber the caseReference for the appeal
 * @property {string} address the address of the site subject to the appeal
 * @property {string | undefined | null} appealType the type of appeal
 * @property {DueDocumentType} nextDocumentDue object with details of the next document due
 * @property {boolean} [isNewAppeal] whether this is a new appeal
 * @property {boolean} [isDraft] whether the appeal submission is in draft state
 * @property {boolean} [displayInvalid] whether an invalidated appeal should be invalidated
 * @property {string | undefined | null} appealDecision the PINS decision in respect of the appeal
 * @property {string | null} [appealDecisionColor] tag color to use for the decision
 * @property {string | undefined | null} caseDecisionOutcomeDate
 * @property {{ appealType: string | undefined, appealId: string | undefined }} [continueParams]
 */

/**
 * @typedef DueDocumentType
 * @type {object}
 * @property {string | Date | null} [deadline] the date by which the document is due
 * @property {number | null} [dueInDays] the number of days remaining until the deadline expires
 * @property {string | null} documentDue the type of document which is due next
 * @property {string | null} [baseUrl] the base url for the document type
 */

const { calculateDueInDays } = require('./calculate-due-in-days');

const {
	getAppealTypeName,
	getAppealTypeNameByTypeCode,
	mapTypeCodeToAppealId
} = require('./full-appeal/map-planning-application');
const { businessRulesDeadline } = require('./calculate-deadline');
const { APPEAL_CASE_STATUS } = require('pins-data-model');
const { calculateDaysSinceInvalidated } = require('./calculate-days-since-invalidated');

const questionnaireBaseUrl = '/manage-appeals/questionnaire';
const statementBaseUrl = '/manage-appeals/appeal-statement';
const finalCommentBaseUrl = '/manage-appeals/final-comments';
const proofsBaseUrl = '/manage-appeals/proofs-of-evidence';

const appellantFinalCommentBaseUrl = '/appeals/final-comments';
const appellantProofsBaseUrl = '/appeals/proof-evidence';

const rule6StatementBaseUrl = 'rule-6/statement';
const rule6ProofsBaseUrl = 'rule-6/proofs-of-evidence';

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
	nextDocumentDue: determineDocumentToDisplayLPADashboard(appealCaseData),
	isNewAppeal: isNewAppeal(appealCaseData),
	displayInvalid: displayInvalidAppeal(appealCaseData),
	appealDecision: mapDecisionLabel(appealCaseData.caseDecisionOutcome),
	appealDecisionColor: mapDecisionColour(appealCaseData.caseDecisionOutcome),
	caseDecisionOutcomeDate: formatDate(appealCaseData.caseDecisionOutcomeDate)
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
			nextDocumentDue: determineDocumentToDisplayAppellantDashboard(appealData),
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
	nextDocumentDue: determineDocumentToDisplayRule6Dashboard(appealCaseData),
	appealDecision: mapDecisionLabel(appealCaseData.caseDecisionOutcome),
	appealDecisionColor: mapDecisionColour(appealCaseData.caseDecisionOutcome),
	caseDecisionOutcomeDate: formatDate(appealCaseData.caseDecisionOutcomeDate)
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
		displayDocumentOnToDo(dashboardData.nextDocumentDue)
	);
};

/**
 * @param {DueDocumentType} dueDocument
 * @returns {boolean}
 */
const displayDocumentOnToDo = (dueDocument) => {
	return !!dueDocument.documentDue && !overdueDocumentNotToBeDisplayed(dueDocument);
};

/**
 * @param {DueDocumentType} dueDocument
 * @returns {boolean}
 */
const overdueDocumentNotToBeDisplayed = (dueDocument) => {
	return dueDocument.dueInDays < 0 && dueDocument.documentDue !== 'Questionnaire';
};

// Appellant Dashboard - ToDo or WaitingToReview FUNCTIONS

/**
 * @param {DashboardDisplayData} dashboardData
 * @returns {boolean}
 */
const isToDoAppellantDashboard = (dashboardData) => {
	return dashboardData.displayInvalid || displayDocumentOnToDo(dashboardData.nextDocumentDue);
};

/**
 * @param {DashboardDisplayData} dashboardData
 * @returns {boolean}
 */
const isToDoRule6Dashboard = (dashboardData) => {
	return displayDocumentOnToDo(dashboardData.nextDocumentDue);
};

/**
 * @param {AppealSubmission} appealSubmission return object from database call
 * @returns {Date | object} returns appeal deadline - note: should return Date as rawDate param set as true
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
 * @param {AppealCaseDetailed} appealCaseData return object from database call
 * @returns {boolean} returns depending on whether a Questionnaire due date has been set
 */
const isNewAppeal = (appealCaseData) => {
	return !appealCaseData.lpaQuestionnaireDueDate;
};

/**
 * @param {AppealCaseDetailed} appealCaseData return object from database call
 * @returns {DueDocumentType} object containing details of next due document
 */
const determineDocumentToDisplayLPADashboard = (appealCaseData) => {
	if (displayInvalidAppeal(appealCaseData)) {
		return {
			deadline: null,
			/// ensures invalid appeals appear at the top of the of the display
			dueInDays: -100000,
			documentDue: null
		};
	} else if (isQuestionnaireDue(appealCaseData)) {
		return {
			deadline: appealCaseData.lpaQuestionnaireDueDate,
			dueInDays: calculateDueInDays(appealCaseData.lpaQuestionnaireDueDate),
			documentDue: 'Questionnaire',
			baseUrl: `${questionnaireBaseUrl}/${appealCaseData.caseReference}`
		};
	} else if (
		isStatementDue(appealCaseData) &&
		!(calculateDueInDays(appealCaseData.statementDueDate) < 0)
	) {
		return {
			deadline: appealCaseData.statementDueDate,
			dueInDays: calculateDueInDays(appealCaseData.statementDueDate),
			documentDue: 'Statement',
			// direct straight to first question of statement journey
			baseUrl: `${statementBaseUrl}/${appealCaseData.caseReference}/appeal-statement`
		};
	} else if (isFinalCommentDue(appealCaseData)) {
		return {
			deadline: appealCaseData.finalCommentsDueDate,
			dueInDays: calculateDueInDays(appealCaseData.finalCommentsDueDate),
			documentDue: 'Final comment',
			baseUrl: `${finalCommentBaseUrl}/${appealCaseData.caseReference}`
		};
	} else if (isProofsOfEvidenceDue(appealCaseData)) {
		return {
			deadline: appealCaseData.proofsOfEvidenceDueDate,
			dueInDays: calculateDueInDays(appealCaseData.proofsOfEvidenceDueDate),
			documentDue: 'Proofs of Evidence',
			baseUrl: `${proofsBaseUrl}/${appealCaseData.caseReference}`
		};
	}

	return {
		deadline: null,
		dueInDays: 100000,
		documentDue: null,
		baseUrl: null
	};
};

/**
 * @param {AppealCaseDetailed | AppealSubmission} caseOrSubmission return object from database call
 * @returns {DueDocumentType} object containing details of next due document
 */
const determineDocumentToDisplayAppellantDashboard = (caseOrSubmission) => {
	if (isAppealSubmission(caseOrSubmission)) {
		const deadline = calculateAppealDueDeadline(caseOrSubmission);
		return {
			deadline,
			dueInDays: calculateDueInDays(deadline),
			documentDue: 'Continue'
		};
	} else if (isV2Submission(caseOrSubmission)) {
		const deadline = calculateAppealDueDeadline(caseOrSubmission);
		return {
			deadline,
			dueInDays: calculateDueInDays(deadline),
			documentDue: 'Continue'
		};
	} else if (displayInvalidAppeal(caseOrSubmission)) {
		return {
			deadline: null,
			/// ensures invalid appeals appear at the top of the of the display
			dueInDays: -100000,
			documentDue: 'Invalid'
		};
	} else if (isAppellantFinalCommentDue(caseOrSubmission)) {
		return {
			deadline: caseOrSubmission.finalCommentsDueDate,
			dueInDays: calculateDueInDays(caseOrSubmission.finalCommentsDueDate),
			documentDue: 'Final comments',
			baseUrl: `${appellantFinalCommentBaseUrl}/${caseOrSubmission.caseReference}`
		};
	} else if (isAppellantProofsOfEvidenceDue(caseOrSubmission)) {
		return {
			deadline: caseOrSubmission.proofsOfEvidenceDueDate,
			dueInDays: calculateDueInDays(caseOrSubmission.proofsOfEvidenceDueDate),
			documentDue: 'Proofs of evidence',
			baseUrl: `${appellantProofsBaseUrl}/${caseOrSubmission.caseReference}`
		};
	}

	return {
		deadline: null,
		dueInDays: 100000,
		documentDue: null,
		baseUrl: null
	};
};

/**
 * @param {AppealCaseDetailed} appealCaseData return object from database call
 * @returns {DueDocumentType} object containing details of next due document
 */
const determineDocumentToDisplayRule6Dashboard = (appealCaseData) => {
	if (isRule6StatementDue(appealCaseData)) {
		return {
			deadline: appealCaseData.rule6StatementDueDate,
			dueInDays: calculateDueInDays(appealCaseData.rule6StatementDueDate),
			documentDue: 'Statement',
			baseUrl: `${rule6StatementBaseUrl}/${appealCaseData.caseReference}`
		};
	} else if (isRule6ProofOfEvidenceDue(appealCaseData)) {
		return {
			deadline: appealCaseData.rule6ProofEvidenceDueDate,
			dueInDays: calculateDueInDays(appealCaseData.rule6ProofEvidenceDueDate),
			documentDue: 'Proof of Evidence',
			baseUrl: `${rule6ProofsBaseUrl}/${appealCaseData.caseReference}`
		};
	}

	return {
		deadline: null,
		dueInDays: 100000,
		documentDue: null,
		baseUrl: null
	};
};

// Helper functions, not exported, potential for refactoring as repetitive

/**
 * @param {AppealCaseDetailed} appealCaseData return object from database call
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
 * @param {AppealCaseDetailed} appealCaseData return object from database call
 * @returns {boolean}
 */
const isStatementDue = (appealCaseData) => {
	return (
		!!appealCaseData.statementDueDate &&
		!appealCaseData.LPAStatementSubmitted &&
		appealCaseData.caseStatus === APPEAL_CASE_STATUS.STATEMENTS
	);
};

/**
 * @param {AppealCaseDetailed} appealCaseData return object from database call
 * @returns {boolean}
 */
const isFinalCommentDue = (appealCaseData) => {
	return (
		!!appealCaseData.finalCommentsDueDate &&
		!appealCaseData.LPACommentsSubmitted &&
		appealCaseData.caseStatus === APPEAL_CASE_STATUS.FINAL_COMMENTS
	);
};

/**
 * @param {AppealCaseDetailed} appealCaseData return object from database call
 * @returns {boolean}
 */
const isProofsOfEvidenceDue = (appealCaseData) => {
	return (
		!!appealCaseData.proofsOfEvidenceDueDate &&
		!appealCaseData.LPAProofsSubmitted &&
		appealCaseData.caseStatus === APPEAL_CASE_STATUS.EVIDENCE
	);
};

/**
 * @param {AppealCaseDetailed} appealCaseData return object from database call
 * @returns {boolean}
 */
const isAppellantFinalCommentDue = (appealCaseData) => {
	return (
		!!appealCaseData.finalCommentsDueDate &&
		!appealCaseData.appellantCommentsSubmitted &&
		appealCaseData.caseStatus === APPEAL_CASE_STATUS.FINAL_COMMENTS
	);
};

/**
 * @param {AppealCaseDetailed} appealCaseData return object from database call
 * @returns {boolean}
 */
const isAppellantProofsOfEvidenceDue = (appealCaseData) => {
	return (
		!!appealCaseData.proofsOfEvidenceDueDate &&
		!appealCaseData.appellantsProofsSubmitted &&
		appealCaseData.caseStatus === APPEAL_CASE_STATUS.EVIDENCE
	);
};

/**
 * @param {AppealCaseDetailed} appealCaseData return object from database call
 * @returns {boolean}
 */
const isRule6StatementDue = (appealCaseData) => {
	return (
		!!appealCaseData.rule6StatementDueDate &&
		!appealCaseData.rule6StatementSubmitted &&
		appealCaseData.caseStatus === APPEAL_CASE_STATUS.STATEMENTS
	);
};

/**
 * @param {AppealCaseDetailed} appealCaseData return object from database call
 * @returns {boolean}
 */
const isRule6ProofOfEvidenceDue = (appealCaseData) => {
	return (
		!!appealCaseData.rule6ProofEvidenceDueDate &&
		!appealCaseData.rule6ProofEvidenceSubmitted &&
		appealCaseData.caseStatus === APPEAL_CASE_STATUS.EVIDENCE
	);
};

/**
 * @param {AppealCaseDetailed} appealCaseData return object from database call
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
 * @param {AppealCaseDetailed | AppealSubmission} appealCaseData return object from database call
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
	determineDocumentToDisplayLPADashboard,
	mapToLPADashboardDisplayData,
	isToDoLPADashboard,
	isToDoAppellantDashboard,
	mapToAppellantDashboardDisplayData,
	mapToRule6DashboardDisplayData,
	isToDoRule6Dashboard
};
