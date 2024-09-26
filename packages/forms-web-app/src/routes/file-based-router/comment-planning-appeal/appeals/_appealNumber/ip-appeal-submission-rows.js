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

const appealSubmissionRows = (caseData) => {
	const documents = caseData.Documents || [];

	return [
		{
			keyText: 'Draft statement of common ground',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.STATEMENT_COMMON_GROUND),
			condition: () => documentExists(documents, APPEAL_DOCUMENT_TYPE.STATEMENT_COMMON_GROUND),
			isEscaped: true
		},
		{
			keyText: 'Appeal statement',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.APPELLANT_STATEMENT),
			condition: () => documentExists(documents, APPEAL_DOCUMENT_TYPE.APPELLANT_STATEMENT),
			isEscaped: true
		},
		{
			keyText: 'Plans or drawings',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.PLANS_DRAWINGS),
			condition: () => documentExists(documents, APPEAL_DOCUMENT_TYPE.PLANS_DRAWINGS),
			isEscaped: true
		},
		{
			keyText: 'Planning obligation',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.PLANNING_OBLIGATION),
			condition: () => documentExists(documents, APPEAL_DOCUMENT_TYPE.PLANNING_OBLIGATION),
			isEscaped: true
		},
		{
			keyText: 'Supporting documents',
			valueText: formatDocumentDetails(documents, APPEAL_DOCUMENT_TYPE.OTHER_NEW_DOCUMENTS),
			condition: () => documentExists(documents, APPEAL_DOCUMENT_TYPE.OTHER_NEW_DOCUMENTS),
			isEscaped: true
		}
	];
};

module.exports = {
	appealSubmissionRows
};
