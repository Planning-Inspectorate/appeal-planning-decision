const {
	mapDecisionColour,
	mapDecisionLabel
} = require('@pins/business-rules/src/utils/decision-outcome');
const { APPEAL_DOCUMENT_TYPE } = require('@planning-inspectorate/data-model');
const { formatDateForDisplay } = require('@pins/common/src/lib/format-date');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');

const decisionDocumentTypes = [
	APPEAL_DOCUMENT_TYPE.APPELLANT_COSTS_DECISION_LETTER,
	APPEAL_DOCUMENT_TYPE.LPA_COSTS_DECISION_LETTER,
	APPEAL_DOCUMENT_TYPE.CASE_DECISION_LETTER
];

/**
 * @typedef {import("./appeals-view").AppealViewModel} AppealViewModel
 * @param {AppealViewModel} appeal
 * @param {import('appeals-service-api').Api.Document[]} unfilteredDecisionDocuments
 * @returns {object }
 */
const formatCommentDecidedData = (appeal, unfilteredDecisionDocuments = []) => {
	if (!appeal.caseDecisionOutcomeDate) return {};

	const isEnforcement =
		appeal.appealTypeCode === CASE_TYPES.ENFORCEMENT.processCode ||
		appeal.appealTypeCode === CASE_TYPES.ENFORCEMENT_LISTED.processCode;

	return {
		formattedCaseDecisionDate: formatDateForDisplay(appeal.caseDecisionOutcomeDate, {
			format: 'd MMMM yyyy'
		}),
		formattedDecisionColour: mapDecisionColour(appeal.caseDecisionOutcome),
		caseDecisionOutcome:
			mapDecisionLabel(appeal.caseDecisionOutcome, isEnforcement) ?? appeal.caseDecisionOutcome,
		decisionDocuments: filterDecisionDocuments(unfilteredDecisionDocuments ?? [])
	};
};

/**
 * @param {import('appeals-service-api').Api.Document[]} documents
 * @return {import('appeals-service-api').Api.Document[]}
 */
const filterDecisionDocuments = (documents) => {
	const decisionDocumentDisplayOrder = {
		[APPEAL_DOCUMENT_TYPE.CASE_DECISION_LETTER]: 0,
		[APPEAL_DOCUMENT_TYPE.APPELLANT_COSTS_DECISION_LETTER]: 1,
		[APPEAL_DOCUMENT_TYPE.LPA_COSTS_DECISION_LETTER]: 2
	};

	const decisionDocuments = documents.filter((document) => {
		if (!document.published) {
			return false;
		}

		// @ts-ignore
		if (decisionDocumentTypes.includes(document.documentType)) {
			return true;
		}
		return false;
	});

	return decisionDocuments.sort(
		(a, b) =>
			decisionDocumentDisplayOrder[a.documentType] - decisionDocumentDisplayOrder[b.documentType]
	);
};

module.exports = {
	formatCommentDecidedData,
	filterDecisionDocuments
};
