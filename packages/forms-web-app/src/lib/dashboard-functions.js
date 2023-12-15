/**
 * @typedef LPAAppealData
 * @type {object}
 * @property {string} caseReference
 * @property {string} caseReferenceSlug
 * @property {string} LPAApplicationReference
 * @property {string} siteAddressLine1
 * @property {string} siteAddressLine2
 * @property {string} siteAddressPostcode
 * @property {string} siteAddressTown
 * @property {string} appealTypeCode
 * @property {string} questionnaireDueDate
 * @property {string} questionnaireReceived
 * @property {string} statementDueDate
 * @property {string} LPAStatementSubmitted
 * @property {string} finalCommentsDueDate
 * @property {string} LPACommentsSubmitted
 * @property {string} proofsOfEvidenceDueDate
 * @property {string} LPAProofsSubmitted
 * @property {string} validity
 * @property {string} LPACode
 */

/**
 * @typedef DashboardAppealType
 * @type {object}
 * @property {string} long a longer form appeal type string, for appellants
 * @property {string} short a shorter form appeal type string, for lpa users
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
	decision: appealCaseData.decision
});

const mapToLPADecidedData = (appealCaseData) => ({
	appealNumber: appealCaseData.caseReference,
	address: formatAddress(appealCaseData),
	appealType: appealCaseData.appealTypeCode,
	decision: formatDecision(appealCaseData.decision),
	caseDecisionDate: appealCaseData.caseDecisionDate
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
 * @param {string} caseReference
 * @returns {string} returns the seven digit appeal number as a string string
 */
// Only required if using old mongo instance rather than sql v2 api

// const extractAppealNumber = (caseReference) => {
// 	return caseReference.split('/').pop();
// };

const formatAddress = (appealCaseData) => {
	if (appealCaseData.siteAddressLine2) {
		return `${appealCaseData.siteAddressLine1}, ${appealCaseData.siteAddressLine2}, ${appealCaseData.siteAddressTown}, ${appealCaseData.siteAddressPostcode}`;
	}

	return `${appealCaseData.siteAddressLine1}, ${appealCaseData.siteAddressTown}, ${appealCaseData.siteAddressPostcode}`;
};

// /**
//  * @param {string} caseDataAppealType
//  * @returns {DashboardAppealType} returns an object with a long and a short appealType string
//  */

// // Only required if using old mongo instance rather than sql v2 api

// const formatAppealType = (caseDataAppealType) => {
// 	if (caseDataAppealType === 'Householder (HAS) Appeal') {
// 		return {
// 			long: 'Householder',
// 			short: 'HAS'
// 		};
// 	} else if (caseDataAppealType === 'Full Planning (S78) Appeal') {
// 		return {
// 			long: 'Full planning',
// 			short: 'S78'
// 		};
// 	}
// };

const formatDecision = (decision) => {
	switch (decision) {
		case 'allowed':
			return 'ALLOWED';
		case 'dismissed':
			return 'DISMISSED';
		case 'split':
			return 'ALLOWED IN PART (SPLIT DECISION)';
		default:
			return decision;
	}
};

/**
 * @param {LPAAppealData} appealCaseData return object from database call
 * @returns {boolean} returns depending on whether a Questionnaire due date has been set
 */

const isNewAppeal = (appealCaseData) => {
	return !appealCaseData.questionnaireDueDate;
};

/**
 * @param {LPAAppealData} appealCaseData return object from database call
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
 * @param {LPAAppealData} appealCaseData return object from database call
 * @returns {boolean}
 */
const isQuestionnaireDue = (appealCaseData) => {
	return appealCaseData.questionnaireDueDate && !appealCaseData.questionnaireReceived;
};

/**
 * @param {object} appealCaseData return object from database call
 * @returns {boolean}
 */
const isStatementDue = (appealCaseData) => {
	return appealCaseData.statementDueDate && !appealCaseData.LPAStatementSubmitted;
};

/**
 * @param {object} appealCaseData return object from database call
 * @returns {boolean}
 */
const isFinalCommentDue = (appealCaseData) => {
	return appealCaseData.finalCommentsDueDate && !appealCaseData.LPACommentsSubmitted;
};

/**
 * @param {object} appealCaseData return object from database call
 * @returns {boolean}
 */
const isProofsOfEvidenceDue = (appealCaseData) => {
	return appealCaseData.proofsOfEvidenceDueDate && !appealCaseData.LPAProofsSubmitted;
};

module.exports = {
	// extractAppealNumber,
	formatAddress,
	// formatAppealType,
	isNewAppeal,
	determineDocumentToDisplayLPADashboard,
	mapToLPADashboardDisplayData,
	mapToLPADecidedData,
	isToDoLPADashboard
};
