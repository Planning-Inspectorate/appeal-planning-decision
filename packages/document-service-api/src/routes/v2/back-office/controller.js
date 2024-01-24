const blobClient = require('#lib/back-office-storage-client');
const config = require('#config/config');
const { isFeatureActive } = require('#config/featureFlag');
const { FLAG } = require('@pins/common/src/feature-flags');
const BlobStorageError = require('@pins/common/src/client/blob-storage-error');
/**
 * @type {import('express').Handler}
 */
async function getDocumentUrl(req, res) {
	if (!(await isFeatureActive(FLAG.SERVE_BO_DOCUMENTS))) {
		res.sendStatus(501);
		return;
	}

	const docName = req.params.document;

	if (!docName) {
		res.sendStatus(400);
		return;
	}

	try {
		const sasUrl = await blobClient.getBlobSASUrl(config.boStorage.container, docName);
		res.status(200).send({
			url: sasUrl
		});
	} catch (error) {
		if (!(error instanceof BlobStorageError)) {
			throw error;
		}

		res.sendStatus(error.code);
	}
}

/**
 * @type {import('express').Handler}
 */
async function downloadDocument(req, res) {
	if (!(await isFeatureActive(FLAG.SERVE_BO_DOCUMENTS))) {
		res.sendStatus(501);
		return;
	}

	const docName = req.params.document;

	if (!docName) {
		res.sendStatus(400);
		return;
	}

	try {
		const blobProperties = await blobClient.getProperties(config.boStorage.container, docName);
		const blob = await blobClient.downloadBlob(config.boStorage.container, docName);

		res.set({
			'content-length': blobProperties.contentLength,
			'content-type': blobProperties.contentType ?? 'application/octet-stream',
			'content-disposition': `attachment;filename="${docName}"`
		});
		blob.readableStreamBody.pipe(res);
	} catch (error) {
		if (!(error instanceof BlobStorageError)) {
			throw error;
		}

		res.sendStatus(error.code);
	}
}

module.exports = {
	getDocumentUrl,
	downloadDocument
};
