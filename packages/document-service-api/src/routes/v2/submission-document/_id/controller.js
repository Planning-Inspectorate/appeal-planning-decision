const logger = require('#lib/logger');
const config = require('#config/config');
const { isFeatureActive } = require('#config/featureFlag');
const { FLAG } = require('@pins/common/src/feature-flags');
const { DocumentsRepository } = require('../../../../db/repos/repository');
const repo = new DocumentsRepository();

const { deleteFile } = require('#lib/blobStorage');
const { initContainerClient } = require('@pins/common');

/**
 * @type {import('express').Handler}
 */
async function deleteDocument(req, res) {
	if (!(await isFeatureActive(FLAG.SERVE_BO_DOCUMENTS))) {
		res.sendStatus(501);
		return;
	}

	const docRef = req.params.id;

	let document;
	try {
		document = await repo.getSubmissionDocument(docRef);
		if (!document) throw new Error('getSubmissionDocument failed');
	} catch (err) {
		logger.error({ err }, `failed to find doc ${docRef}`);
		res.sendStatus(404);
		return;
	}

	try {
		// todo: use /common/src/client/blob-storage-client
		const containerClient = await initContainerClient(config);
		await deleteFile(containerClient, document.location);
		await repo.deleteSubmissionDocument(docRef);

		res.status(200).send();
		return;
	} catch (error) {
		logger.error({ error }, 'failed to remove document');
		res.sendStatus(500);
	}
}

module.exports = {
	deleteDocument
};
