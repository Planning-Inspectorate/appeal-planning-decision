/**
 * @typedef AppealType
 * @type {object}
 * @property {string} long a longer form appeal type string, for appellants
 * @property {string} short a shorter form appeal type string, for lpa users
 */

const { calculateDueInDays } = require('./calculate-due-in-days');

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
 * @returns {AppealType} returns an object with a long and a short appealType string
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
 * @param {object} appealCaseData return object from database call
 * @returns {string} returns either 'NEW' or the appropriate deadline
 */

const determineDeadlineToDisplayLPADashboard = (appealCaseData) => {
	if (!appealCaseData.questionnaireDueDate) {
		return 'NEW';
	} else if (!appealCaseData.questionnaireReceived) {
		return appealCaseData.questionnaireDueDate;
	} else if (appealCaseData.statementDueDate && !appealCaseData.LPAStatementSubmitted) {
		return appealCaseData.statementDueDate;
	} else if (appealCaseData.finalCommentsDueDate && !appealCaseData.LPACommentsSubmitted) {
		return appealCaseData.finalCommentsDueDate;
	} else if (appealCaseData.proofsOfEvidenceDueDate && !appealCaseData.LPAProofsSubmitted) {
		return appealCaseData.proofsOfEvidenceDueDate;
	}

	return '';
};

/**
 * @param {string} deadline a string of either 'NEW' or the appropriate deadline
 * @returns {string} returns either 'OVERDUE' or the appropriate number of days until deadline
 */

const displayDueInDaysLPADashboard = (deadline) => {
	if (deadline == 'NEW' || deadline == '') {
		return '';
	}
	const numberOfDays = calculateDueInDays(deadline);
	if (numberOfDays < 0) {
		return 'OVERDUE';
	} else if (numberOfDays == 1) {
		return '1 day';
	}
	return `${numberOfDays} days`;
};

/**
 * @param {object} appealCaseData return object from database call
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
	determineDeadlineToDisplayLPADashboard,
	displayDueInDaysLPADashboard,
	isQuestionnaireDue,
	isStatementDue,
	isFinalCommentDue,
	isProofsOfEvidenceDue
};
