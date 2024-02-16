const blobClient = require('#lib/back-office-storage-client');
const config = require('#config/config');
const { isFeatureActive } = require('#config/featureFlag');
const { FLAG } = require('@pins/common/src/feature-flags');
const BlobStorageError = require('@pins/common/src/client/blob-storage-error');
const { canAccessBODocument } = require('@pins/business-rules/src/rules/documents/access');

/**
 * @param {*} doc
 * @param {import('express-oauth2-jwt-bearer').JWTPayload} access_token
 */
async function checkDocAccess(doc, access_token) {
	let role;
	if (access_token.sub !== access_token.client_id) {
		// lookup user but how are they connected to doc to find this out??
		// could this come from scopes?
		// const user = await userRepo.find(access_token.sub);
	}

	if (
		!canAccessBODocument({
			docMetaData: doc,
			client: access_token.client_id,
			role
		})
	) {
		throw new Error('auth error - 403');
	}
}

/**
 * @type {import('express').Handler}
 */
async function getDocumentUrl(req, res) {
	if (!(await isFeatureActive(FLAG.SERVE_BO_DOCUMENTS))) {
		res.sendStatus(501);
		return;
	}

	const docName = req.body?.document; //todo: doc id from sql instead of blob uri?

	await checkDocAccess(docName, req.auth?.payload);

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

	// decode base64 encoded string
	const docName = Buffer.from(req.params.document, 'base64url').toString();

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
