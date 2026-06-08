const { APPEAL_DOCUMENT_TYPE } = require('@planning-inspectorate/data-model');
const { documentExists, formatDocumentDetails } = require('@pins/common');

/**
 * @param {{ caseData: import('appeals-service-api').Api.AppealCaseDetailed, userType: string }} params
 * @returns {import("@pins/common/src/view-model-maps/rows/def").Rows}
 */
exports.originalEvidenceRows = ({ caseData }) => {
	const documents = caseData.Documents || [];
	return [
		{
			keyText: 'Design and access statement',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.DESIGN_ACCESS_STATEMENT_LPA),
			condition: () => documentExists(documents, APPEAL_DOCUMENT_TYPE.DESIGN_ACCESS_STATEMENT_LPA),
			isEscaped: true
		},
		{
			keyText: 'Plans and drawings',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.PLANS_DRAWINGS_LPA),
			condition: () => documentExists(documents, APPEAL_DOCUMENT_TYPE.PLANS_DRAWINGS_LPA),
			isEscaped: true
		},
		{
			keyText: 'Any other documents submitted with the application',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.ADDITIONAL_DOCUMENTS_LPA),
			condition: () => documentExists(documents, APPEAL_DOCUMENT_TYPE.ADDITIONAL_DOCUMENTS_LPA),
			isEscaped: true
		},
		{
			keyText: 'What documents and plans did you use to make your decision?',
			valueText: caseData.listOfDocumentsBeforeDecision,
			condition: () => !!caseData.listOfDocumentsBeforeDecision
		}
	];
};
