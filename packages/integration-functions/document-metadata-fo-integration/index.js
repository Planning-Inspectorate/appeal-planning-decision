const got = require('got');
const VALID_SCAN_STATUSES = ['scanned'];
const VALID_PUBLISHED_STATUSES = ['published', 'archived'];

/**
 * @typedef {Object} ServiceBusMessage
 * @property {DocumentPayload} body
 */

/**
 * @typedef {Object} DocumentPayload
 * @property {string} documentId - The unique identifier for the file. This will be different to documentReference
 * @property {string | undefined} caseRef
 * @property {number} caseId The unique identifier within the Back Office. This is not the same as the case reference
 * @property {string | null | undefined} documentReference - Reference used throughout ODT <CaseRef>-<SequenceNo>
 * @property {number | null} version
 * @property {string | null} examinationRefNo
 * @property {string | null} filename - Current stored filename of the file
 * @property {string | null} originalFilename - Original filename of file
 * @property {number | null} size
 * @property {string | null} mime
 * @property {string | undefined} documentURI
 * @property {string | undefined} publishedDocumentURI
 * @property {"not_scanned" | "scanned" | "affected | null"} virusCheckStatus
 * @property {string | null} fileMD5
 * @property {string | null} dateCreated - Date format: date-time
 * @property {string | undefined} lastModified - Date format: date-time
 * @property {"submitted" | "internal" | "draft"} documentStatus
 * @property {"not_redacted" | "redacted | null"} redactedStatus
 * @property {"not_checked" | "checked" | "ready_to_publish" | "do_not_publish" | "publishing" | "published" | "archived | null"} publishedStatus
 * @property {string | undefined} datePublished - Date format: date-time
 * @property {string | null} documentType
 * @property {"public" | "official" | "secret" | "top-secret | null"} securityClassification
 * @property {"appeals" | "back_office" | "horizon" | "ni_file" | "sharepoint | null"} sourceSystem
 * @property {"pins" | "citizen" | "lpa" | "ogd | null"} origin
 * @property {string | null} owner
 * @property {string | null} author - Name of person who authored document
 * @property {string | null} representative - The on behalf of or agent submitter of document
 * @property {string | null} description
 * @property {"draft" | "pre-application" | "acceptance" | "pre-examination" | "examination" | "recommendation" | "decision" | "post_decision" | "withdrawn" | "developers_application | null"} stage
 * @property {string | null} filter1 - Filter field to provide additional filtering
 * @property {string | null} filter2 - Filter field to provide additional filtering
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
 * @param {DocumentPayload} documentMessage
 */
async function processDocumentMetadata(context, documentMessage) {
	if (!checkMessageIsValid(documentMessage)) {
		context.log('Invalid message status, skipping');
		return;
	}

	context.log('Sending document metadata message to API');
	const documentMetadataUrl = `https://${process.env.FO_APPEALS_API}/document-metadata/${documentMessage.documentId}`;
	await got
		.put(documentMetadataUrl, {
			json: documentMessage
		})
		.json();

	context.log(`Finished handling: ${documentMessage.documentId}`);
}

/**
 * Checks message validity
 * @param {DocumentPayload} documentMessage
 * @returns {Boolean} false if this message can be ignored, true if status is valid
 * @throws {Error} message schema is invalid
 */
function checkMessageIsValid(documentMessage) {
	let isValid = false;

	if (
		!documentMessage.virusCheckStatus ||
		!documentMessage.publishedStatus ||
		!documentMessage.documentId
	) {
		throw new Error('Invalid message schema');
	}

	if (
		VALID_SCAN_STATUSES.includes(documentMessage.virusCheckStatus) &&
		VALID_PUBLISHED_STATUSES.includes(documentMessage.publishedStatus)
	) {
		isValid = true;
	}

	return isValid;
}
