/**
 * appeal-document
 * service bus topic trigger
 * consumes document metadata messages from BO
 * document metadata represent files attached to appeal cases
 * ignore messages if not published/scanned/redacted
 * currently this is assuming that all docs meeting this criteria will be publicly available and so FO can just link users to the storage account uri directly
 */

const { app } = require('@azure/functions');
const { APPEAL_VIRUS_CHECK_STATUS, APPEAL_REDACTED_STATUS } = require('pins-data-model');

const VALID_SCAN_STATUSES = [APPEAL_VIRUS_CHECK_STATUS.SCANNED];
const VALID_REDACTED_STATUSES = [
	APPEAL_REDACTED_STATUS.REDACTED,
	APPEAL_REDACTED_STATUS.NO_REDACTION_REQUIRED
];
const createApiClient = require('../common/api-client');

/**
 * @typedef {import('pins-data-model/src/schemas').AppealDocument} AppealDocument
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
	let isValid = false;

	context.log('documentMessage.virusCheckStatus ', documentMessage.virusCheckStatus);
	context.log('documentMessage.datePublished ', documentMessage.datePublished);
	context.log('documentMessage.redactedStatus ', documentMessage.redactedStatus);
	context.log('documentMessage.documentId ', documentMessage.documentId);

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

/**
 * @param {import('@azure/functions').InvocationContext} context
 * @returns {boolean}
 */
const documentShouldBeDeleted = (context) =>
	context?.triggerMetadata?.applicationProperties?.type === 'Delete';

app.serviceBusTopic('appeal-document', {
	topicName: 'appeal-document',
	subscriptionName: 'appeal-document-fo-sub',
	connection: 'ServiceBusConnection',
	handler: handler
});

module.exports = handler;
