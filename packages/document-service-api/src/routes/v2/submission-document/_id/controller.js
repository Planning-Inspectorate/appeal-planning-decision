const logger = require('#lib/logger');
const config = require('#config/config');
const { isFeatureActive } = require('#config/featureFlag');
const { FLAG } = require('@pins/common/src/feature-flags');
const { DocumentsRepository } = require('../../../../db/repos/repository');
const repo = new DocumentsRepository();
const blobClient = require('#lib/front-office-storage-client');
const BlobStorageError = require('@pins/common/src/client/blob-storage-error');
const { deleteFile } = require('#lib/blobStorage');
const { initContainerClient } = require('@pins/common');

/**
 * @type {import('express').Handler}
 */
async function downloadDocument(req, res) {
	if (!(await isFeatureActive(FLAG.SERVE_BO_DOCUMENTS))) {
		res.sendStatus(501);
		return;
	}

	const userId = req.auth.payload.sub;
	const userLpa = req.id_token?.lpaCode;

	if (!userId) {
		res.sendStatus(401);
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

	if (userLpa) {
		await repo.lpaCanModifyCase({
			caseReference: document.LPAQuestionnaireSubmission.appealCaseReference,
			userLpa
		});
	} else {
		await repo.userOwnsAppealSubmission({
			appellantSubmissionId: document.appellantSubmissionId,
			userId
		});
	}

	try {
		const sasUrl = await blobClient.getBlobSASUrl(config.storage.container, document.location);
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
	} catch (error) {
		logger.error({ error }, 'failed to remove document');
		res.sendStatus(500);
	}
}

module.exports = {
	downloadDocument,
	deleteDocument
};
