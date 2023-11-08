const got = require('got');
const VALID_SCAN_STATUSES = ['scanned'];
const VALID_PUBLISHED_STATUSES = ['published', 'archived'];
const VALID_REDACTED_STATUSES = ['redacted'];

/**
 * @typedef {import('@pins/common/schema/documentMetadata.js').DocumentMetadata} DocumentMetadata
 */

/**
 * @typedef {Object} ServiceBusMessage
 * @property {DocumentMetadata} body
 */

/**
 * @param {import('@azure/functions').Context} context
 * @param {ServiceBusMessage} msg
 */
module.exports = async function (context, msg) {
	context.log('Handle document metadata message', msg);
	await processDocumentMetadata(context, msg.body);
};

/**
 * @param {import('@azure/functions').Context} context
 * @param {DocumentMetadata} documentMessage
 */
async function processDocumentMetadata(context, documentMessage) {
	if (!checkMessageIsValid(documentMessage)) {
		context.log('Invalid message status, skipping');
		return;
	}

	context.log('Sending document metadata message to API');
	const documentMetadataUrl = `https://${process.env.FO_APPEALS_API}/document-meta-data/${documentMessage.documentId}`;
	await got
		.put(documentMetadataUrl, {
			json: documentMessage
		})
		.json();

	context.log(`Finished handling: ${documentMessage.documentId}`);
}

/**
 * Checks message validity
 * @param {DocumentMetadata} documentMessage
 * @returns {Boolean} false if this message can be ignored, true if status is valid
 * @throws {Error} message schema is invalid
 */
function checkMessageIsValid(documentMessage) {
	let isValid = false;

	if (
		!documentMessage.virusCheckStatus ||
		!documentMessage.publishedStatus ||
		!documentMessage.redactedStatus ||
		!documentMessage.documentId
	) {
		throw new Error('Invalid message schema');
	}

	if (
		VALID_SCAN_STATUSES.includes(documentMessage.virusCheckStatus) &&
		VALID_PUBLISHED_STATUSES.includes(documentMessage.publishedStatus) &&
		VALID_REDACTED_STATUSES.includes(documentMessage.redactedStatus)
	) {
		isValid = true;
	}

	return isValid;
}
