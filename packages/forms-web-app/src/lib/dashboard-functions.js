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
 * @property {string | undefined | null} appealDecision the PINS decision in respect of the appeal
 * @property {string | null} [appealDecisionColor] tag color to use for the decision
 * @property {string | undefined | null} caseDecisionOutcomeDate
 * @property {{ appealType: string | undefined, appealId: string | undefined }} [continueParams]
 */

/**
 * @typedef DueDocumentType
 * @type {object}
 * @property {string} [deadline] the date by which the document is due
 * @property {number} [dueInDays] the number of days remaining until the deadline expires
 * @property {string} documentDue the type of document which is due next
 * @property {string} [baseUrl] the base url for the document type
 */

const { calculateDueInDays } = require('./calculate-due-in-days');

const {
	getAppealTypeName,
	getAppealTypeNameByTypeCode,
	mapTypeCodeToAppealId
} = require('./full-appeal/map-planning-application');
const { businessRulesDeadline } = require('./calculate-deadline');

const questionnaireBaseUrl = '/manage-appeals/questionnaire';
const statementBaseUrl = '/manage-appeals/appeal-statement';
const finalCommentBaseUrl = '/manage-appeals/appeal-comment';
const proofsBaseUrl = '/manage-appeals/proofs-of-evidence';

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
	appealDecision: mapDecisionLabel(appealCaseData.caseDecisionOutcome),
	appealDecisionColor: mapDecisionColour(appealCaseData.caseDecisionOutcome),
	caseDecisionOutcomeDate: formatDate(appealCaseData.caseDecisionOutcomeDate)
});

/**
 * @param {AppealSubmission | AppealCaseDetailed} appealData
 * @returns {DashboardDisplayData}
 */
const mapToAppellantDashboardDisplayData = (appealData) => ({
	appealId: isAppealSubmission(appealData) ? appealData._id : appealData.id,
	appealNumber:
		isAppealSubmission(appealData) || isV2Submission(appealData) ? '' : appealData.caseReference,
	address: formatAddress(appealData),
	appealType: getAppealType(appealData),
	nextDocumentDue: determineDocumentToDisplayAppellantDashboard(appealData),
	isDraft: isAppealSubmission(appealData) || isV2Submission(appealData),
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
});

// LPADashboard - ToDo or WaitingToReview FUNCTIONS

/**
 * @param {DashboardDisplayData} dashboardData
 * @returns {boolean}
 */
const isToDoLPADashboard = (dashboardData) => {
	return dashboardData.isNewAppeal || displayDocumentOnToDo(dashboardData.nextDocumentDue);
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
	if (isQuestionnaireDue(appealCaseData)) {
		return {
			deadline: appealCaseData.lpaQuestionnaireDueDate,
			dueInDays: calculateDueInDays(appealCaseData.lpaQuestionnaireDueDate),
			documentDue: 'Questionnaire',
			baseUrl: questionnaireBaseUrl
		};
	} else if (
		isStatementDue(appealCaseData) &&
		!(calculateDueInDays(appealCaseData.statementDueDate) < 0)
	) {
		return {
			deadline: appealCaseData.statementDueDate,
			dueInDays: calculateDueInDays(appealCaseData.statementDueDate),
			documentDue: 'Statement',
			baseUrl: statementBaseUrl
		};
	} else if (isFinalCommentDue(appealCaseData)) {
		return {
			deadline: appealCaseData.finalCommentsDueDate,
			dueInDays: calculateDueInDays(appealCaseData.finalCommentsDueDate),
			documentDue: 'Final comment',
			baseUrl: finalCommentBaseUrl
		};
	} else if (isProofsOfEvidenceDue(appealCaseData)) {
		return {
			deadline: appealCaseData.proofsOfEvidenceDueDate,
			dueInDays: calculateDueInDays(appealCaseData.proofsOfEvidenceDueDate),
			documentDue: 'Proofs of Evidence',
			baseUrl: proofsBaseUrl
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
	} else if (isAppellantFinalCommentDue(caseOrSubmission)) {
		return {
			deadline: caseOrSubmission.finalCommentsDueDate,
			dueInDays: calculateDueInDays(caseOrSubmission.finalCommentsDueDate),
			documentDue: 'Final comments'
		};
	} else if (isAppellantProofsOfEvidenceDue(caseOrSubmission)) {
		return {
			deadline: caseOrSubmission.proofsOfEvidenceDueDate,
			dueInDays: calculateDueInDays(caseOrSubmission.proofsOfEvidenceDueDate),
			documentDue: 'Proofs of evidence'
		};
	}

	return {
		deadline: null,
		dueInDays: 100000,
		documentDue: null
	};
};

// Helper functions, not exported, potential for refactoring as repetitive

/**
 * @param {AppealCaseDetailed} appealCaseData return object from database call
 * @returns {boolean}
 */
const isQuestionnaireDue = (appealCaseData) => {
	return !!appealCaseData.lpaQuestionnaireDueDate && !appealCaseData.lpaQuestionnaireSubmittedDate;
};

/**
 * @param {AppealCaseDetailed} appealCaseData return object from database call
 * @returns {boolean}
 */
const isStatementDue = (appealCaseData) => {
	return !!appealCaseData.statementDueDate && !appealCaseData.LPAStatementSubmitted;
};

/**
 * @param {AppealCaseDetailed} appealCaseData return object from database call
 * @returns {boolean}
 */
const isFinalCommentDue = (appealCaseData) => {
	return !!appealCaseData.finalCommentsDueDate && !appealCaseData.LPACommentsSubmitted;
};

/**
 * @param {AppealCaseDetailed} appealCaseData return object from database call
 * @returns {boolean}
 */
const isProofsOfEvidenceDue = (appealCaseData) => {
	return !!appealCaseData.proofsOfEvidenceDueDate && !appealCaseData.LPAProofsSubmitted;
};

/**
 * @param {AppealCaseDetailed} appealCaseData return object from database call
 * @returns {boolean}
 */
const isAppellantFinalCommentDue = (appealCaseData) => {
	return !!appealCaseData.finalCommentsDueDate && !appealCaseData.appellantCommentsSubmitted;
};

/**
 * @param {AppealCaseDetailed} appealCaseData return object from database call
 * @returns {boolean}
 */
const isAppellantProofsOfEvidenceDue = (appealCaseData) => {
	return !!appealCaseData.proofsOfEvidenceDueDate && !appealCaseData.appellantsProofsSubmitted;
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
	mapToAppellantDashboardDisplayData
};
