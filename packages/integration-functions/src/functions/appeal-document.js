/**
 * appeal-document
 * service bus topic trigger
 * consumes document metadata messages from BO
 * document metadata represent files attached to appeal cases
 * ignore messages if not published/scanned/redacted
 * currently this is assuming that all docs meeting this criteria will be publicly available and so FO can just link users to the storage account uri directly
 */

const { app } = require('@azure/functions');
const VALID_SCAN_STATUSES = ['scanned'];
const VALID_REDACTED_STATUSES = ['redacted'];
const createApiClient = require('../common/api-client');

/**
 * @typedef {import('pins-data-model/src/schemas').AppealDocument} AppealDocument
 */

/**
 * @type {import('@azure/functions').ServiceBusTopicHandler}
 */
const handler = async (message, context) => {
	context.log('Handle document metadata message', message);
	await processDocumentMetadata(context, message);
	return {};
};

/**
 * @param {import('@azure/functions').InvocationContext} context
 * @param {AppealDocument} documentMessage
 */
async function processDocumentMetadata(context, documentMessage) {
	if (!checkMessageIsValid(documentMessage)) {
		context.log('Invalid message status, skipping');
		return;
	}
	const client = await createApiClient();

	// todo: use api client
	context.log('Sending document metadata message to API');
	await client.putAppealDocument(documentMessage);
	context.log(`Finished handling: ${documentMessage.documentId}`);
}

/**
 * Checks message validity
 * @param {AppealDocument} documentMessage
 * @returns {Boolean} false if this message can be ignored, true if status is valid
 * @throws {Error} message schema is invalid
 */
function checkMessageIsValid(documentMessage) {
	let isValid = false;

	console.log('documentMessage.virusCheckStatus ', documentMessage.virusCheckStatus);
	console.log('documentMessage.datePublished ', documentMessage.datePublished);
	console.log('documentMessage.redactedStatus ', documentMessage.redactedStatus);
	console.log('documentMessage.documentId ', documentMessage.documentId);

	if (
		!documentMessage.virusCheckStatus ||
		!documentMessage.datePublished ||
		!documentMessage.redactedStatus ||
		!documentMessage.documentId
	) {
		throw new Error('Invalid message schema');
	}

	if (
		VALID_SCAN_STATUSES.includes(documentMessage.virusCheckStatus) &&
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
