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

const appealSubmissionRows = (caseData) => {
	/** @type {Documents} */
	// @ts-ignore
	const documents = caseData.Documents || [];

	return [
		{
			keyText: 'Draft statement of common ground',
			valueText: formatDocumentDetails(documents, 'statementCommonGround'),
			shouldDisplay: true
		},
		{
			keyText: 'Appeal statement',
			valueText: formatDocumentDetails(documents, 'appellantStatement'),
			shouldDisplay: true
		},
		{
			keyText: 'Plans or drawings',
			valueText: formatDocumentDetails(documents, 'plansDrawings'),
			shouldDisplay: true
		},
		{
			keyText: 'Planning obligation',
			valueText: formatDocumentDetails(documents, 'planningObligation'),
			shouldDisplay: true
		},
		{
			keyText: 'Supporting documents',
			valueText: formatDocumentDetails(documents, 'otherNewDocuments'),
			shouldDisplay: true
		}
	];
};

module.exports = {
	appealSubmissionRows
};
