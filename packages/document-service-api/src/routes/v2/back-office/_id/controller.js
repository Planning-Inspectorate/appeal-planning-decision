const blobClient = require('#lib/back-office-storage-client');
const logger = require('#lib/logger');
const config = require('#config/config');
const BlobStorageError = require('@pins/common/src/client/blob-storage-error');
const { checkDocAccess } = require('@pins/common/src/access/document-access');
const { DocumentsRepository } = require('../../../../db/repos/repository');
const repo = new DocumentsRepository();

/**
 * @type {import('express').Handler}
 */
async function getDocumentUrl(req, res) {
	const docRef = req.params?.id;
	const access_token = req.auth?.payload;

	if (!docRef) {
		res.sendStatus(400);
		return;
	}

	let documentWithAppeal;
	try {
		documentWithAppeal = await repo.getDocumentWithAppeal(docRef);
	} catch (err) {
		logger.error({ err }, `failed to find doc ${docRef}`);
		res.sendStatus(404);
		return;
	}

	// Fetch user roles associated with the appeal
	const appealUserRoles = await repo.getAppealUserRoles({
		appealId: documentWithAppeal.AppealCase.appealId,
		userId: access_token?.sub || ''
	});

	if (
		!checkDocAccess({
			logger: logger,
			documentWithAppeal: documentWithAppeal,
			appealUserRoles: appealUserRoles,
			access_token: access_token,
			id_token: req.id_token
		})
	) {
		res.sendStatus(401);
		return;
	}

	try {
		const sasUrl = await blobClient.getBlobSASUrl(
			config.boStorage.container,
			documentWithAppeal.documentURI,
			undefined,
			documentWithAppeal.filename
		);
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

module.exports = {
	getDocumentUrl
};
