const escape = require('escape-html');
/**
 * @param {import('appeals-service-api').Api.Document[]} documents
 * @param {string} documentType
 */
exports.formatDocumentDetails = (documents, documentType) => {
	const filteredDocuments = documents.filter((document) => document.documentType === documentType);

	return filteredDocuments.length > 0 ? filteredDocuments.map(formatDocumentLink).join('\n') : 'No';
};

/**
 * @param {import("../client/appeals-api-client").AppealCaseDetailed} caseData
 */
exports.formatNewDescription = (caseData) => {
	if (caseData.updateDevelopmentDescription && caseData.developmentDescriptionDetails) {
		return caseData.developmentDescriptionDetails;
	}

	return 'No';
};

/**
 *
 * @param {import('appeals-service-api').Api.Document} document
 * @returns {string}
 */
const formatDocumentLink = (document) => {
	return `<a href=# class="govuk-link">${escape(document.filename)}</a>`;
};
