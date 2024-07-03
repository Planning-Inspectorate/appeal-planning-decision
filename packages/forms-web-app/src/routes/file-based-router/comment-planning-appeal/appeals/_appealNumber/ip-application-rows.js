const { formatDocumentDetails } = require('@pins/common');

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
			valueText: formatDocumentDetails(documents, 'applicationDecision'),
			condition: () => caseData
		},
		{
			keyText: 'Application',
			valueText: formatDocumentDetails(documents, 'originalApplicationForm'),
			condition: () => caseData
		},
		{
			keyText: 'Plans, drawings and supporting documents',
			valueText: formatDocumentDetails(documents, 'plansDrawings'),
			condition: () => caseData
		},
		{
			keyText: 'Design and access statement',
			valueText: formatDocumentDetails(documents, 'designAccessStatement'),
			condition: () => caseData
		}
	];
};

module.exports = {
	applicationRows
};
