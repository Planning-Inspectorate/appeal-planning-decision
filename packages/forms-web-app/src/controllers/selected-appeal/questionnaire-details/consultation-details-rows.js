const { formatYesOrNo, formatDocumentDetails } = require('@pins/common');

/**
 * @param {import('appeals-service-api').Api.AppealCaseDetailed } caseData
 * @returns {import("@pins/common/src/view-model-maps/rows/def").Rows}
 */
exports.consultationRows = (caseData) => {
	const documents = caseData.Documents || [];
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
			valueText: formatDocumentDetails(documents, 'consultationResponses'),
			condition: () => caseData.uploadConsultationResponses,
			isEscaped: true
		},
		{
			keyText: 'Representations from other parties',
			valueText: formatYesOrNo(caseData, 'otherPartyRepresentations'),
			condition: () => caseData.otherPartyRepresentations,
			isEscaped: true
		},
		{
			keyText: 'Uploaded representations from other parties',
			valueText: formatDocumentDetails(documents, 'otherPartyRepresentations'),
			condition: () => caseData.uploadRepresentations,
			isEscaped: true
		}
	];
};
