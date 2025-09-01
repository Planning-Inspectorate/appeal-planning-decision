/**
 * appeal-document
 * service bus topic trigger
 * consumes document metadata messages from BO
 * document metadata represent files attached to appeal cases
 * ignore messages if not published/scanned/redacted
 * currently this is assuming that all docs meeting this criteria will be publicly available and so FO can just link users to the storage account uri directly
 */

const { app } = require('@azure/functions');
const {
	APPEAL_VIRUS_CHECK_STATUS,
	MESSAGE_EVENT_TYPE
} = require('@planning-inspectorate/data-model');

const VALID_SCAN_STATUSES = [APPEAL_VIRUS_CHECK_STATUS.SCANNED];
const createApiClient = require('../common/api-client');

/**
 * @typedef {import('@planning-inspectorate/data-model/src/schemas').AppealDocument} AppealDocument
 */

/**
 * @type {import('@azure/functions').ServiceBusTopicHandler}
 */
const handler = async (message, context) => {
	context.debug('Handle document metadata message', message);
	await processDocumentMetadata(context, message);
	return {};
};

/**
 * @param {import('@azure/functions').InvocationContext} context
 * @param {AppealDocument} documentMessage
 */
async function processDocumentMetadata(context, documentMessage) {
	const client = await createApiClient();
	if (documentShouldBeDeleted(context)) {
		context.log('Sending delete request to API');
		await client.deleteAppealDocument(documentMessage.documentId);
		context.log(`Finished handling: ${documentMessage.documentId}`);
		return;
	}

	if (!checkMessageIsValid(documentMessage, context)) {
		context.log('Invalid message status, skipping');
		return;
	}

	context.log('Sending document metadata message to API');
	await client.putAppealDocument(documentMessage);
	context.log(`Finished handling: ${documentMessage.documentId}`);
}

/**
 * Checks message validity
 * @param {AppealDocument} documentMessage
 * @param {import('@azure/functions').InvocationContext} context
 * @returns {Boolean} false if this message can be ignored, true if status is valid
 * @throws {Error} message schema is invalid
 */
function checkMessageIsValid(documentMessage, context) {
	context.log('documentMessage.virusCheckStatus ', documentMessage);

	if (!documentMessage.virusCheckStatus || !documentMessage.documentId) {
		throw new Error('Invalid message schema');
	}

	return (
		!!documentMessage.datePublished &&
		VALID_SCAN_STATUSES.includes(documentMessage.virusCheckStatus)
	);
}

/**
 * @param {import('@azure/functions').InvocationContext} context
 * @returns {boolean}
 */
const documentShouldBeDeleted = (context) =>
	context?.triggerMetadata?.applicationProperties?.type === MESSAGE_EVENT_TYPE.DELETE;

app.serviceBusTopic('appeal-document', {
	topicName: 'appeal-document',
	subscriptionName: 'appeal-document-fo-sub',
	connection: 'ServiceBusConnection',
	handler: handler
});

module.exports = handler;
