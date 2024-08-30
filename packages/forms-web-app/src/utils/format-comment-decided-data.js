const { formatDate } = require('./format-date');
const { mapDecisionColour } = require('@pins/business-rules/src/utils/decision-outcome');
const { APPEAL_CASE_DECISION_OUTCOME, APPEAL_DOCUMENT_TYPE } = require('pins-data-model');

/**
 * @typedef {import("./appeals-view").AppealViewModel} AppealViewModel
 * @param {AppealViewModel} appeal
 * @returns {object }
 */
exports.formatCommentDecidedData = (appeal) => {
	if (!appeal.caseDecisionOutcomeDate) return {};

	return {
		formattedCaseDecisionDate: formatDate(appeal.caseDecisionOutcomeDate),
		formattedDecisionColour: mapDecisionColour(appeal.caseDecisionOutcome),
		caseDecisionOutcome:
			appeal.caseDecisionOutcome in APPEAL_CASE_DECISION_OUTCOME
				? APPEAL_CASE_DECISION_OUTCOME[appeal.caseDecisionOutcome].name
				: appeal.caseDecisionOutcome,
		decisionDocuments: filterDecisionDocuments(appeal.Documents)
	};
};

/**
 * @param {import('appeals-service-api').Api.Document[]} documents
 * @return {import('appeals-service-api').Api.Document[]}
 */
const filterDecisionDocuments = (documents) =>
	documents.filter(
		(document) => document.documentType === APPEAL_DOCUMENT_TYPE.CASE_DECISION_LETTER
	);
