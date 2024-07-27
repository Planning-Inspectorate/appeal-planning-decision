const blobClient = require('#lib/back-office-storage-client');
const logger = require('#lib/logger');
const config = require('#config/config');
const { isFeatureActive } = require('#config/featureFlag');
const { FLAG } = require('@pins/common/src/feature-flags');
const { LPA_USER_ROLE } = require('@pins/common/src/constants');
const BlobStorageError = require('@pins/common/src/client/blob-storage-error');
const { canAccessBODocument, CLIENT_CREDS_ROLE } = require('./access-rules');
const { AppealUserRepository } = require('../../../db/repos/repository');
const repo = new AppealUserRepository();

/**
 * @param {import("@prisma/client").Document & { AppealCase: { LPACode:string, appealId: string} }} documentWithAppeal
 * @param {object} access_token
 * @param {object} id_token
 * @param {import('express-oauth2-jwt-bearer').JWTPayload} access_token
 */
async function checkDocAccess(documentWithAppeal, access_token, id_token) {
	let role = null;

	if (access_token.sub === access_token.aud) {
		role = CLIENT_CREDS_ROLE;
	} else if (id_token?.lpaCode === documentWithAppeal.AppealCase.LPACode) {
		role = LPA_USER_ROLE;
	} else {
		const appealUser = await repo.getAppealUser({
			appealId: documentWithAppeal.AppealCase.appealId,
			userId: access_token.sub
		});
		role = appealUser?.role;
	}

	return canAccessBODocument({
		docMetaData: documentWithAppeal,
		role
	});
}

/**
 * @type {import('express').Handler}
 */
async function getDocumentUrl(req, res) {
	if (!(await isFeatureActive(FLAG.SERVE_BO_DOCUMENTS))) {
		res.sendStatus(501);
		return;
	}

	const docRef = req.body?.document;

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

	if (!(await checkDocAccess(documentWithAppeal, req.auth.payload, req.id_token))) {
		res.sendStatus(401);
		return;
	}

	try {
		const sasUrl = await blobClient.getBlobSASUrl(
			config.boStorage.container,
			documentWithAppeal.documentURI
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
