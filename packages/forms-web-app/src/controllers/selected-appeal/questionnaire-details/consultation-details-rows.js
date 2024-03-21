const { formatYesOrNo, formatDocumentDetails } = require('@pins/common');

/**
 * @param {import('appeals-service-api').Api.AppealCaseWithAppellant } caseData
 * @returns {import("@pins/common/src/view-model-maps/rows/def").Rows}
 */
exports.consultationRows = (caseData) => {
	const documents = caseData.Documents || [];
	return [
		{
			keyText: 'Statutory consultees',
			valueText: formatYesOrNo(caseData, 'statutoryConsultees'),
			condition: (caseData) => caseData.statutoryConsultees
		},
		{
			keyText: 'Responses or standing advice',
			valueText: formatYesOrNo(caseData, 'consultationResponses'),
			condition: (caseData) => caseData.consultationResponses
		},
		{
			keyText: 'Uploaded consultation responses and standing advice',
			valueText: formatDocumentDetails(documents, 'consultationResponses'),
			condition: (caseData) => caseData.uploadConsultationResponses
		},
		{
			keyText: 'Representations from other parties',
			valueText: formatYesOrNo(caseData, 'otherPartyRepresentations'),
			condition: (caseData) => caseData.otherPartyRepresentations
		},
		{
			keyText: 'Uploaded representations from other parties',
			valueText: formatDocumentDetails(documents, 'otherPartyRepresentations'),
			condition: (caseData) => caseData.uploadRepresentations
		}
	];
};
