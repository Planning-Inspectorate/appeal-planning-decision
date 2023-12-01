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
 * @property {string} appealType
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
 */

const { calculateDueInDays } = require('./calculate-due-in-days');

const mapToLPADashboardDisplayData = (appealCaseData) => {
	return {
		...appealCaseData,
		appealNumber: extractAppealNumber(appealCaseData.caseReference),
		address: formatAddress(appealCaseData),
		appealType: formatAppealType(appealCaseData.appealType),
		nextDocumentDue: determineDocumentToDisplayLPADashboard(appealCaseData),
		isNewAppeal: isNewAppeal(appealCaseData)
	};
};

const isToDoLPADashboard = (appeal) => {
	if (
		appeal.isNewAppeal ||
		(appeal.nextDocumentDue.documentDue &&
			!(
				appeal.nextDocumentDue.dueInDays < 0 &&
				appeal.nextDocumentDue.documentDue !== 'Questionnaire'
			))
	) {
		return true;
	}
	return false;
};

/**
 * @param {string} caseReference
 * @returns {string} returns the seven digit appeal number as a string string
 */
const extractAppealNumber = (caseReference) => {
	return caseReference.split('/').pop();
};

const formatAddress = (appealCaseData) => {
	if (appealCaseData.siteAddressLine2) {
		return `${appealCaseData.siteAddressLine1}, ${appealCaseData.siteAddressLine2}, ${appealCaseData.siteAddressTown}, ${appealCaseData.siteAddressPostcode}`;
	}

	return `${appealCaseData.siteAddressLine1}, ${appealCaseData.siteAddressTown}, ${appealCaseData.siteAddressPostcode}`;
};

/**
 * @param {string} caseDataAppealType
 * @returns {DashboardAppealType} returns an object with a long and a short appealType string
 */
const formatAppealType = (caseDataAppealType) => {
	if (caseDataAppealType === 'Householder (HAS) Appeal') {
		return {
			long: 'Householder',
			short: 'HAS'
		};
	} else if (caseDataAppealType === 'Full Planning (S78) Appeal') {
		return {
			long: 'Full planning',
			short: 'S78'
		};
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
			documentDue: 'Questionnaire'
		};
	} else if (isStatementDue(appealCaseData)) {
		return {
			deadline: appealCaseData.statementDueDate,
			dueInDays: calculateDueInDays(appealCaseData.statementDueDate),
			documentDue: 'Statement'
		};
	} else if (isFinalCommentDue(appealCaseData)) {
		return {
			deadline: appealCaseData.finalCommentsDueDate,
			dueInDays: calculateDueInDays(appealCaseData.finalCommentsDueDate),
			documentDue: 'Final comment'
		};
	} else if (isProofsOfEvidenceDue(appealCaseData)) {
		return {
			deadline: appealCaseData.proofsOfEvidenceDueDate,
			dueInDays: calculateDueInDays(appealCaseData.proofsOfEvidenceDueDate),
			documentDue: 'Proofs of Evidence'
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
	extractAppealNumber,
	formatAddress,
	formatAppealType,
	isNewAppeal,
	determineDocumentToDisplayLPADashboard,
	mapToLPADashboardDisplayData,
	isToDoLPADashboard
};
