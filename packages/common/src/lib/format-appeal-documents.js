const escape = require('escape-html');
const { LPA_NOTIFICATION_METHODS } = require('../database/data-static');
const LPA_NOTIFICATION_METHODS_ARRAY = Object.values(LPA_NOTIFICATION_METHODS);

/**
 * @param {import('appeals-service-api').Api.Document[]} documents
 * @param {string} documentType
 */
exports.formatDocumentDetails = (documents, documentType) => {
	const filteredDocuments = documents.filter((document) => document.documentType === documentType);

	return filteredDocuments.length > 0
		? filteredDocuments.map(exports.formatDocumentLink).join('\n')
		: 'No';
};

/**
 * @param {import('appeals-service-api').Api.Document[]} documents
 * @param {string} documentType
 */
exports.documentExists = (documents, documentType) => {
	const filteredDocuments = documents?.filter((document) => document.documentType === documentType);

	return !!filteredDocuments && filteredDocuments.length > 0;
};

/**
 * @param {import("../client/appeals-api-client").AppealCaseDetailed} caseData
 * @returns {boolean}
 */
exports.hasNotificationMethods = (caseData) =>
	!!caseData.AppealCaseLpaNotificationMethod && !!caseData.AppealCaseLpaNotificationMethod.length;

/**
 * @param {import("../client/appeals-api-client").AppealCaseDetailed} caseData
 * @returns {string|undefined}
 */
exports.formatNotificationMethod = (caseData) => {
	if (!exports.hasNotificationMethods(caseData)) {
		return '';
	}

	const methods = caseData.AppealCaseLpaNotificationMethod?.map((x) => {
		const method = LPA_NOTIFICATION_METHODS_ARRAY.find((obj) => {
			return obj.key === x.lPANotificationMethodsKey;
		});

		return method?.name;
	}).filter(Boolean);

	return methods?.join('\n');
};

/**
 * @param {import('appeals-service-api').Api.Document} document
 * @returns {string}
 */
exports.formatDocumentLink = (document) => {
	if (document.redacted) {
		return `<a href="/published-document/${document.id}" class="govuk-link">${escape(
			document.filename
		)}</a>`;
	}

	return escape(document.filename) + ' - awaiting review';
};

/**
 * @param {import('appeals-service-api').Api.Document[]} documents
 * @returns {import('appeals-service-api').Api.Document[]}
 */
exports.sortDocumentsByDate = (documents) => {
	return documents.sort((a, b) => new Date(a.datePublished) - new Date(b.datePublished));
};

/**
 * @param {import('appeals-service-api').Api.Document[]} documents
 * @param {string} documentType
 */
exports.formatDocumentsAsNumberedList = (documents, documentType) => {
	const filteredDocuments = documents.filter((document) => document.documentType === documentType);

	if (filteredDocuments.length < 1) {
		return 'No';
	}

	if (filteredDocuments.length === 1) {
		return exports.formatDocumentLink(filteredDocuments[0]);
	}

	let listHtml = '<ol>';
	filteredDocuments.forEach((filteredDocument) => {
		listHtml += `<li>${exports.formatDocumentLink(filteredDocument)}</li>`;
	});
	listHtml += '</ol>';
	return listHtml;
};
