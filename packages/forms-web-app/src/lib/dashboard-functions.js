/**
 * @typedef {import('appeals-service-api').Api.AppealCaseWithAppellant} AppealCaseWithAppellant
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

const questionnaireBaseUrl = '/manage-appeals/questionnaire';
const statementBaseUrl = '/manage-appeals/appeal-statement';
const finalCommentBaseUrl = '/manage-appeals/appeal-comment';
const proofsBaseUrl = '/manage-appeals/proofs-of-evidence';

const mapToLPADashboardDisplayData = (appealCaseData) => ({
	...appealCaseData,
	appealNumber: appealCaseData.caseReference,
	address: formatAddress(appealCaseData),
	appealType: appealCaseData.appealTypeCode,
	nextDocumentDue: determineDocumentToDisplayLPADashboard(appealCaseData),
	isNewAppeal: isNewAppeal(appealCaseData),
	decision: appealCaseData.outcome
});

const mapToLPADecidedData = (appealCaseData) => ({
	appealNumber: appealCaseData.caseReference,
	address: formatAddress(appealCaseData),
	appealType: appealCaseData.appealTypeCode,
	decision: formatDecision(appealCaseData.outcome),
	caseDecisionDate: appealCaseData.caseDecisionDate
});

const mapToAppellantDashboardDisplayData = (appealCaseData) => ({
	...appealCaseData,
	address: formatAddress(appealCaseData),
	isDraft: appealCaseData?.appeal?.state === APPEAL_STATE.DRAFT,
	appealType: getAppealType(appealCaseData),
	decisionOutcome: getDecisionOutcome(appealCaseData.outcome)
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

const formatDecision = (decision) => {
	switch (decision) {
		case 'allowed':
			return 'ALLOWED';
		case 'dismissed':
			return 'DISMISSED';
		case 'split decision':
			return 'allowed in part';
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
 * @returns {string}
 */
const getAppealType = (appealCaseData) => {
	if (appealCaseData?.appeal?.state === APPEAL_STATE.DRAFT) {
		return getAppealTypeName(appealCaseData.appeal.appealType);
	}
	return `${appealCaseData.appealTypeName} appeal`;
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

module.exports = {
	formatAddress,
	isNewAppeal,
	determineDocumentToDisplayLPADashboard,
	mapToLPADashboardDisplayData,
	mapToLPADecidedData,
	isToDoLPADashboard,
	mapToAppellantDashboardDisplayData,
	getDecisionOutcome
};
