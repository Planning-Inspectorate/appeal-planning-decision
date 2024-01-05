/**
 * @typedef {import('appeals-service-api').Api.AppealCaseWithAppellant} AppealCaseWithAppellant
 * @typedef {import('appeals-service-api').Api.AppealSubmission} AppealSubmission
 */

/**
 * @typedef DueDocumentType
 * @type {object}
 * @property {string} deadline the date by which the document is due
 * @property {number} dueInDays the number of days remaining until the deadline expires
 * @property {string} documentDue the type of document which is due next
 * @property {string} baseUrl the base url for the document type
 */

const { calculateDueInDays } = require('./calculate-due-in-days');

const { APPEAL_STATE, DECISION_OUTCOME } = require('@pins/business-rules/src/constants');
const { getAppealTypeName } = require('./full-appeal/map-planning-application');
const { businessRulesDeadline } = require('./calculate-deadline');

const questionnaireBaseUrl = '/manage-appeals/questionnaire';
const statementBaseUrl = '/manage-appeals/appeal-statement';
const finalCommentBaseUrl = '/manage-appeals/appeal-comment';
const proofsBaseUrl = '/manage-appeals/proofs-of-evidence';

/**
 * @param {AppealCaseWithAppellant} appealCaseData
 */

const mapToLPADashboardDisplayData = (appealCaseData) => ({
	...appealCaseData,
	appealNumber: appealCaseData.caseReference,
	address: formatAddress(appealCaseData),
	appealType: appealCaseData.appealTypeCode,
	nextDocumentDue: determineDocumentToDisplayLPADashboard(appealCaseData),
	isNewAppeal: isNewAppeal(appealCaseData),
	decision: appealCaseData.outcome
});

/**
 * @param {AppealCaseWithAppellant} appealCaseData
 */

const mapToLPADecidedData = (appealCaseData) => ({
	appealNumber: appealCaseData.caseReference,
	address: formatAddress(appealCaseData),
	appealType: appealCaseData.appealTypeCode,
	decision: formatDecision(appealCaseData.outcome),
	caseDecisionDate: appealCaseData.caseDecisionDate
});

/**
 * @param {AppealSubmission | AppealCaseWithAppellant} appealData
 */

const mapToAppellantDashboardDisplayData = (appealData) => ({
	...appealData,
	address: formatAddress(appealData),
	isDraft: isAppealSubmission(appealData),
	appealType: getAppealType(appealData),
	nextDocumentDue: determineDocumentToDisplayAppellantDashboard(appealData),
	decisionOutcome: getDecisionOutcome(appealData.outcome)
});

const isToDoLPADashboard = (appeal) => {
	return appeal.isNewAppeal || displayDocumentOnToDo(appeal.nextDocumentDue);
};

/**
 * @param {DueDocumentType} dueDocument
 * @returns {boolean}
 */
const displayDocumentOnToDo = (dueDocument) => {
	return dueDocument.documentDue && !overdueDocumentNotToBeDisplayed(dueDocument);
};

/**
 * @param {DueDocumentType} dueDocument
 * @returns {boolean}
 */
const overdueDocumentNotToBeDisplayed = (dueDocument) => {
	return dueDocument.dueInDays < 0 && dueDocument.documentDue !== 'Questionnaire';
};

/**
 * @param {AppealCaseWithAppellant} appealCaseData
 * @returns {string}
 */
const formatAddress = (appealCaseData) => {
	const addressComponents = [
		appealCaseData.siteAddressLine1,
		appealCaseData.siteAddressLine2,
		appealCaseData.siteAddressTown,
		appealCaseData.siteAddressPostcode
	];

	return addressComponents.filter(Boolean).join(', ');
};

/**
 * @param {AppealSubmission} appealCaseData return object from database call
 * @returns {boolean} returns depending on whether a Questionnaire due date has been set
 */

const calculateAppealDueDeadline = (appealCaseData) => {
	return businessRulesDeadline(
		appealCaseData.appeal?.decisionDate,
		appealCaseData.appeal?.typeOfPlanningAppeal,
		null,
		true
	);
};

const formatDecision = (decision) => {
	switch (decision) {
		case 'allowed':
			return 'ALLOWED';
		case 'dismissed':
			return 'DISMISSED';
		case 'split decision':
			return 'ALLOWED IN PART';
		default:
			return decision;
	}
};

/**
 * @param {AppealCaseWithAppellant} appealCaseData return object from database call
 * @returns {boolean} returns depending on whether a Questionnaire due date has been set
 */

const isNewAppeal = (appealCaseData) => {
	return !appealCaseData.questionnaireDueDate;
};

/**
 * @param {AppealCaseWithAppellant} appealCaseData return object from database call
 * @returns {DueDocumentType} object containing details of next due document
 */
const determineDocumentToDisplayLPADashboard = (appealCaseData) => {
	if (isQuestionnaireDue(appealCaseData)) {
		return {
			deadline: appealCaseData.questionnaireDueDate,
			dueInDays: calculateDueInDays(appealCaseData.questionnaireDueDate),
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

const determineDocumentToDisplayAppellantDashboard = (caseOrSubmission) => {
	if (isAppealSubmission(caseOrSubmission)) {
		return {
			deadline: calculateAppealDueDeadline(caseOrSubmission),
			documentDue: 'Continue'
		};
	} else if (isAppellantFinalCommentDue(caseOrSubmission)) {
		return {
			deadline: caseOrSubmission.finalCommentsDueDate,
			documentDue: 'Final comments'
		};
	} else if (isAppellantProofsOfEvidenceDue(caseOrSubmission)) {
		return {
			deadline: caseOrSubmission.proofsOfEvidenceDueDate,
			documentDue: 'Proofs of evidence'
		};
	}
};

// Helper functions, not exported, potential for refactoring as repetitive

/**
 * @param {AppealCaseWithAppellant} appealCaseData return object from database call
 * @returns {boolean}
 */
const isQuestionnaireDue = (appealCaseData) => {
	return appealCaseData.questionnaireDueDate && !appealCaseData.questionnaireReceived;
};

/**
 * @param {AppealCaseWithAppellant} appealCaseData return object from database call
 * @returns {boolean}
 */
const isStatementDue = (appealCaseData) => {
	return appealCaseData.statementDueDate && !appealCaseData.LPAStatementSubmitted;
};

/**
 * @param {AppealCaseWithAppellant} appealCaseData return object from database call
 * @returns {boolean}
 */
const isFinalCommentDue = (appealCaseData) => {
	return appealCaseData.finalCommentsDueDate && !appealCaseData.LPACommentsSubmitted;
};

/**
 * @param {AppealCaseWithAppellant} appealCaseData return object from database call
 * @returns {boolean}
 */
const isProofsOfEvidenceDue = (appealCaseData) => {
	return appealCaseData.proofsOfEvidenceDueDate && !appealCaseData.LPAProofsSubmitted;
};

/**
 * @param {AppealCaseWithAppellant} appealCaseData return object from database call
 * @returns {boolean}
 */
const isAppellantFinalCommentDue = (appealCaseData) => {
	return appealCaseData.finalCommentsDueDate && !appealCaseData.appellantCommentsSubmitted;
};

/**
 * @param {AppealCaseWithAppellant} appealCaseData return object from database call
 * @returns {boolean}
 */
const isAppellantProofsOfEvidenceDue = (appealCaseData) => {
	return appealCaseData.proofsOfEvidenceDueDate && !appealCaseData.appellantsProofsSubmitted;
};

/**
 * @param {AppealCaseWithAppellant} appealCaseData return object from database call
 * @returns {string}
 */
const getAppealType = (appealCaseData) => {
	if (appealCaseData?.appeal?.state === APPEAL_STATE.DRAFT) {
		return getAppealTypeName(appealCaseData.appeal.appealType);
	}
	return `${appealCaseData.appealTypeName} appeal`;
};

/**
 * @param {AppealCaseWithAppellant} appealCaseData
 * @returns {boolean}
 */
const isEligibilityCompleted = (appealCaseData) => {
	if (appealCaseData?.appeal?.state === APPEAL_STATE.DRAFT) {
		const eligibility = appealCaseData.appeal.eligibility;
		return (
			eligibility !== undefined &&
			eligibility.enforcementNotice !== null &&
			eligibility.applicationDecision !== null &&
			eligibility.applicationCategories !== null
		);
	}
	return true;
};

/**
 * @param {AppealCaseWithAppellant | AppealSubmission } appealCaseData
 * @returns {boolean}
 */
const hasDecisionDate = (appealCaseData) => {
	if (appealCaseData?.appeal?.state === APPEAL_STATE.DRAFT) {
		return appealCaseData.appeal.decisionDate !== null;
	}
	return appealCaseData.caseDecisionDate !== null;
};

/**
 * @param {AppealCaseWithAppellant} appealCaseData
 * @returns {boolean}
 */
const hasFutureDueDate = (appealCaseData) => {
	const currentDate = new Date();
	return (
		[
			calculateAppealDueDeadline(
				appealCaseData.appealTypeCode,
				appealCaseData.originalCaseDecisionDate
			),
			appealCaseData.statementDueDate,
			appealCaseData.finalCommentsDueDate,
			appealCaseData.proofsOfEvidenceDueDate
		].find((date) => {
			if (!date) return false;
			return new Date(date) > currentDate;
		}) !== undefined
	);
};

const getDecisionOutcome = (outcome) => {
	if (!outcome) return null;
	switch (outcome) {
		case DECISION_OUTCOME.ALLOWED:
			return 'allowed';
		case DECISION_OUTCOME.DISMISSED:
			return 'dismissed';
		case DECISION_OUTCOME.SPLIT_DECISION:
			return 'allowed in part';
		default:
			return outcome;
	}
};

/**
 * @param {AppealSubmission | AppealCaseWithAppellant} caseOrSubmission
 * @returns {caseOrSubmission is AppealSubmission}
 */
function isAppealSubmission(caseOrSubmission) {
	return Object.hasOwn(caseOrSubmission, 'appeal');
}

module.exports = {
	formatAddress,
	isNewAppeal,
	determineDocumentToDisplayLPADashboard,
	mapToLPADashboardDisplayData,
	mapToLPADecidedData,
	isToDoLPADashboard,
	mapToAppellantDashboardDisplayData,
	getDecisionOutcome,
	isEligibilityCompleted,
	hasDecisionDate,
	hasFutureDueDate
};
