const { formatDocumentDetails } = require('@pins/common');

/**
 * @typedef {import('appeals-service-api').Api.AppealCaseWithAppellant} AppealCaseWithAppellant
 * @typedef {import("@pins/common/src/view-model-maps/rows/def").Rows} Rows
 */

/**
 * @param {AppealCaseWithAppellant } caseData
 * @returns {Rows}
 */

const appealSubmissionRows = (caseData) => {
	const documents = caseData.Documents || [];

	return [
		{
			keyText: 'Draft statement of common ground',
			valueText: formatDocumentDetails(documents, 'statementCommonGround'),
			condition: (caseData) => caseData
		},
		{
			keyText: 'Appeal statement',
			valueText: formatDocumentDetails(documents, 'appellantStatement'),
			condition: (caseData) => caseData
		},
		{
			keyText: 'Plans or drawings',
			valueText: formatDocumentDetails(documents, 'plansDrawings'),
			condition: (caseData) => caseData
		},
		{
			keyText: 'Planning obligation',
			valueText: formatDocumentDetails(documents, 'planningObligation'),
			condition: (caseData) => caseData
		},
		{
			keyText: 'Supporting documents',
			valueText: formatDocumentDetails(documents, 'otherNewDocuments'),
			condition: (caseData) => caseData
		}
	];
};

module.exports = {
	appealSubmissionRows
};
