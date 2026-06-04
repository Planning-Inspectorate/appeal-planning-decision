const crypto = require('node:crypto');

/**
 * @param {string} caseReference
 * @param {string} documentType
 * @param {Object} options
 * @param {boolean} [options.published]
 * @param {boolean} [options.redacted]
 * @returns {import('@pins/database/src/client/client').Prisma.DocumentCreateInputWithoutAppealCase}
 */
exports.createTestDocData = (
	caseReference,
	documentType,
	{ published = true, redacted = true } = {}
) => ({
	caseReference,
	documentType,
	published,
	redacted,
	id: crypto.randomUUID(),
	filename: `${documentType}.pdf`,
	originalFilename: `${documentType}.pdf`,
	mime: 'application/pdf',
	size: 1234,
	documentURI: `http://example.com/${documentType}.pdf`,
	publishedDocumentURI: published ? `http://example.com/${documentType}.pdf` : null,
	dateCreated: new Date(),
	virusCheckStatus: 'scanned',
	version: 1
});
