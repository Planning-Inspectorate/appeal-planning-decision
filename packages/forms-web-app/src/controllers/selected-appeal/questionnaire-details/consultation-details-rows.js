const {
	formatYesOrNo,
	formatDocumentDetails,
	documentExists,
	boolToYesNo
} = require('@pins/common');
const { APPEAL_DOCUMENT_TYPE } = require('pins-data-model');

/**
 * @param {import('appeals-service-api').Api.AppealCaseDetailed } caseData
 * @returns {import("@pins/common/src/view-model-maps/rows/def").Rows}
 */
exports.consultationRows = (caseData) => {
	const documents = caseData.Documents || [];
	const hasOtherPartyRepresentations = documentExists(
		documents,
		APPEAL_DOCUMENT_TYPE.OTHER_PARTY_REPRESENTATIONS
	);
	const otherPartyRepresentationsText = boolToYesNo(hasOtherPartyRepresentations);

	return [
		{
			keyText: 'Statutory consultees',
			valueText: formatYesOrNo(caseData, 'statutoryConsultees'),
			condition: () => caseData.statutoryConsultees
		},
		{
			keyText: 'Responses or standing advice',
			valueText: formatYesOrNo(caseData, 'consultationResponses'),
			condition: () => caseData.consultationResponses
		},
		{
			keyText: 'Uploaded consultation responses and standing advice',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.CONSULTATION_RESPONSES),
			condition: () => documentExists(documents, APPEAL_DOCUMENT_TYPE.CONSULTATION_RESPONSES),
			isEscaped: true
		},
		{
			keyText: 'Representations from other parties',
			valueText: otherPartyRepresentationsText,
			condition: () => true,
			isEscaped: true
		},
		{
			keyText: 'Uploaded representations from other parties',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.OTHER_PARTY_REPRESENTATIONS),
			condition: () => hasOtherPartyRepresentations,
			isEscaped: true
		}
	];
};
