/**
 * @param {import('appeals-service-api').Api.Document[]} documents
 * @param {string} documentType
 */
exports.formatDocumentDetails = (documents, documentType) => {
	const filteredDocuments = documents.filter((document) => document.documentType === documentType);

	return filteredDocuments.length > 0
		? filteredDocuments.map(formatDocumentLink).join('<br>')
		: 'No';
};

/**
 * @param {import("../client/appeals-api-client").AppealCaseWithAppellant} caseData
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
	return `<a href=${document.documentURI} class="govuk-link">${document.filename}</a>`;
};
