/**
 * @typedef {import('appeals-service-api').Api.AppealCaseWithAppellant} AppealCaseWithAppellant
 * @typedef {import('appeals-service-api').Api.AppealSubmission} AppealSubmission
 */

/**
 * @typedef DueDocumentType
 * @type {object}
 * @property {string} deadline the date by which the document is due
 * @property {number} [dueInDays] the number of days remaining until the deadline expires
 * @property {string} documentDue the type of document which is due next
 * @property {string} [baseUrl] the base url for the document type
 */

const { calculateDueInDays } = require('./calculate-due-in-days');

const { DECISION_OUTCOME } = require('@pins/business-rules/src/constants');
const { getAppealTypeName } = require('./full-appeal/map-planning-application');
const { businessRulesDeadline } = require('./calculate-deadline');

const questionnaireBaseUrl = '/manage-appeals/questionnaire';
const statementBaseUrl = '/manage-appeals/appeal-statement';
const finalCommentBaseUrl = '/manage-appeals/appeal-comment';
const proofsBaseUrl = '/manage-appeals/proofs-of-evidence';

// MAP DATABASE RETURN OBJECTS TO DASHBOARD DISPLAY DATA

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
	decision: getDecisionOutcome(appealCaseData.outcome),
	caseDecisionDate: appealCaseData.caseDecisionDate
});

/**
 * @param {AppealSubmission | AppealCaseWithAppellant} appealData
 */

const mapToAppellantDashboardDisplayData = (appealData) => ({
	...appealData,
	appealNumber: isAppealSubmission(appealData) ? null : appealData.caseReference,
	address: formatAddress(appealData),
	appealType: getAppealType(appealData),
	nextDocumentDue: determineDocumentToDisplayAppellantDashboard(appealData),
	isDraft: isAppealSubmission(appealData),
	decisionOutcome: isAppealSubmission(appealData) ? null : getDecisionOutcome(appealData.outcome)
});

// LPADashboard - ToDo or WaitingToReview FUNCTIONS

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

// Appellant Dashboard - ToDo or WaitingToReview FUNCTIONS

const isToDoAppellantDashboard = (appeal) => {
	return displayDocumentOnToDo(appeal.nextDocumentDue);
};

/**
 * @param {AppealCaseWithAppellant | AppealSubmission} appealCaseData
 * @returns {string}
 */
const formatAddress = (appealCaseData) => {
	if (isAppealSubmission(appealCaseData)) {
		return formatAppealSubmissionAddress(appealCaseData);
	}

	const addressComponents = [
		appealCaseData.siteAddressLine1,
		appealCaseData.siteAddressLine2,
		appealCaseData.siteAddressTown,
		appealCaseData.siteAddressPostcode
	];

	return addressComponents.filter(Boolean).join(', ');
};

/**
 * @param {AppealSubmission} appealSubmission
 * @returns {string}
 */
const formatAppealSubmissionAddress = (appealSubmission) => {
	if (!appealSubmission.appeal?.appealSiteSection?.siteAddress) {
		return '';
	}
	const address = appealSubmission.appeal?.appealSiteSection?.siteAddress;

	const addressComponents = [
		address.addressLine1,
		address.addressLine2,
		address.town,
		address.postcode
	];

	return addressComponents.filter(Boolean).join(', ');
};

/**
 * @param {AppealSubmission} appealSubmission return object from database call
 * @returns {Date | object} returns appeal deadline - note: should return Date as rawDate param set as true
 */

const calculateAppealDueDeadline = (appealSubmission) => {
	return businessRulesDeadline(
		appealSubmission.appeal?.decisionDate,
		appealSubmission.appeal?.appealType,
		null,
		true
	);
};

/**
 * @param {string | undefined} decision the decision in relation to the appeal
 * @returns {string | undefined}
 */

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

/**
 * @param {AppealCaseWithAppellant | AppealSubmission} caseOrSubmission return object from database call
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
 * @param {AppealCaseWithAppellant | AppealSubmission} appealCaseData return object from database call
 * @returns {string}
 */
const getAppealType = (appealCaseData) => {
	if (isAppealSubmission(appealCaseData)) {
		return getAppealTypeName(appealCaseData.appeal?.appealType);
	}
	return `${appealCaseData.appealTypeName} appeal`;
};

/**
 * @param {string | undefined} outcome the decision in relation to the appeal
 * @returns {string | null}
 */

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
	isToDoAppellantDashboard,
	mapToAppellantDashboardDisplayData,
	getDecisionOutcome
};
