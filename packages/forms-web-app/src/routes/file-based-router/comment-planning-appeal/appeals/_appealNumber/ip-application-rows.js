const { formatDocumentDetails, documentExists } = require('@pins/common');
const { APPEAL_DOCUMENT_TYPE } = require('pins-data-model');

/**
 * @typedef {import('appeals-service-api').Api.AppealCaseDetailed} AppealCaseDetailed
 * @typedef {import("@pins/common/src/view-model-maps/rows/def").Rows} Rows
 */

/**
 * @param {AppealCaseDetailed } caseData
 * @returns {Rows}
 */

const applicationRows = (caseData) => {
	const documents = caseData.Documents || [];

	return [
		{
			keyText: 'Description of development',
			valueText: caseData.developmentDescription,
			condition: () => caseData.developmentDescription
		},
		{
			keyText: 'Application decision notice',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.APPLICATION_DECISION_LETTER),
			condition: () => documentExists(documents, APPEAL_DOCUMENT_TYPE.APPLICATION_DECISION_LETTER),
			isEscaped: true
		},
		{
			keyText: 'Application',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.ORIGINAL_APPLICATION_FORM),
			condition: () => documentExists(documents, APPEAL_DOCUMENT_TYPE.ORIGINAL_APPLICATION_FORM),
			isEscaped: true
		},
		{
			keyText: 'Plans, drawings and supporting documents',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.PLANS_DRAWINGS),
			condition: () => documentExists(documents, APPEAL_DOCUMENT_TYPE.PLANS_DRAWINGS),
			isEscaped: true
		},
		{
			keyText: 'Design and access statement',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.DESIGN_ACCESS_STATEMENT),
			condition: () => documentExists(documents, APPEAL_DOCUMENT_TYPE.DESIGN_ACCESS_STATEMENT),
			isEscaped: true
		}
	];
};

module.exports = {
	applicationRows
};
