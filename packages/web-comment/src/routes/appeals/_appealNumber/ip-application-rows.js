const { formatDocumentDetails } = require('@pins/common');

/**
 * @typedef {import('appeals-service-api').Api.AppealCaseWithAppellant} AppealCaseWithAppellant
 * @typedef {import("@pins/common/src/view-model-maps/rows/def").Rows} Rows
 * @typedef {import('appeals-service-api').Api.Document[]} Documents
 */

/**
 * @param {AppealCaseWithAppellant } caseData
 * @returns {Rows}
 */

const applicationRows = (caseData) => {
	/** @type {Documents} */
	// @ts-ignore
	const documents = caseData.Documents || [];

	return [
		{
			keyText: 'Description of development',
			valueText: caseData.developmentDescription,
			shouldDisplay: !!caseData.developmentDescription
		},
		{
			keyText: 'Application decision notice',
			valueText: formatDocumentDetails(documents, 'applicationDecision'),
			shouldDisplay: true
		},
		{
			keyText: 'Application',
			valueText: formatDocumentDetails(documents, 'originalApplicationForm'),
			shouldDisplay: true
		},
		{
			keyText: 'Plans, drawings and supporting documents',
			valueText: formatDocumentDetails(documents, 'plansDrawings'),
			shouldDisplay: true
		},
		{
			keyText: 'Design and access statement',
			valueText: formatDocumentDetails(documents, 'designAccessStatement'),
			shouldDisplay: true
		}
	];
};

module.exports = {
	applicationRows
};
