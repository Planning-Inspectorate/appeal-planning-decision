/**
 * appeal-document
 * service bus topic trigger
 * consumes document metadata messages from BO
 * document metadata represent files attached to appeal cases
 * ignore messages if not published/scanned/redacted
 * currently this is assuming that all docs meeting this criteria will be publicly available and so FO can just link users to the storage account uri directly
 */

const { app } = require('@azure/functions');
const got = require('got');
const VALID_SCAN_STATUSES = ['scanned'];
const VALID_PUBLISHED_STATUSES = ['published', 'archived'];
const VALID_REDACTED_STATUSES = ['redacted'];

/**
 * @typedef {import('@pins/common/schema/documentMetadata.js').DocumentMetadata} DocumentMetadata
 */

/**
 * @type {import('@azure/functions').ServiceBusTopicHandler}
 */
const handler = async (message, context) => {
	context.log('Handle document metadata message', message);
	await processDocumentMetadata(context, message.body);
	return {};
};

/**
 * @param {import('@azure/functions').InvocationContext} context
 * @param {DocumentMetadata} documentMessage
 */
async function processDocumentMetadata(context, documentMessage) {
	if (!checkMessageIsValid(documentMessage)) {
		context.log('Invalid message status, skipping');
		return;
	}

	// todo: use api client
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

app.serviceBusTopic('appeal-document', {
	topicName: 'appeal-document',
	subscriptionName: 'appeal-document-fo-sub',
	connection: 'ServiceBusConnection',
	handler: handler
});

module.exports = handler;
