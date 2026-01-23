const { formatDocumentDetails, documentExists, boolToYesNo } = require('@pins/common');
const { APPEAL_DOCUMENT_TYPE } = require('@planning-inspectorate/data-model');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');

/**
 * @param {import('appeals-service-api').Api.AppealCaseDetailed } caseData
 * @returns {import("@pins/common/src/view-model-maps/rows/def").Rows}
 */
exports.consultationRows = (caseData) => {
	if (caseData.appealTypeCode === CASE_TYPES.ENFORCEMENT.processCode) return [];

	const documents = caseData.Documents || [];
	const hasOtherPartyRepresentations = documentExists(
		documents,
		APPEAL_DOCUMENT_TYPE.OTHER_PARTY_REPRESENTATIONS
	);
	const otherPartyRepresentationsText = boolToYesNo(hasOtherPartyRepresentations);

	const isS20orS78 =
		caseData.appealTypeCode === CASE_TYPES.S20.processCode ||
		caseData.appealTypeCode === CASE_TYPES.S78.processCode;

	return [
		{
			keyText: 'Statutory consultees',
			valueText: caseData.statutoryConsultees ? `Yes\n${caseData.consultedBodiesDetails}` : 'No',
			condition: () => caseData.statutoryConsultees != null
		},
		{
			keyText: 'Responses or standing advice',
			valueText: boolToYesNo(
				documentExists(documents, APPEAL_DOCUMENT_TYPE.CONSULTATION_RESPONSES)
			),
			condition: () => isS20orS78
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
