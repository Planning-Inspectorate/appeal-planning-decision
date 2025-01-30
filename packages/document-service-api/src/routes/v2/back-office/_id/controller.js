const blobClient = require('#lib/back-office-storage-client');
const logger = require('#lib/logger');
const config = require('#config/config');
const { isFeatureActive } = require('#config/featureFlag');
const { FLAG } = require('@pins/common/src/feature-flags');
const { LPA_USER_ROLE, APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const BlobStorageError = require('@pins/common/src/client/blob-storage-error');
const { canAccessBODocument, CLIENT_CREDS_ROLE } = require('./access-rules');
const { DocumentsRepository } = require('../../../../db/repos/repository');
const repo = new DocumentsRepository();

/**
 * @param {import("@prisma/client").Document & { AppealCase: { LPACode:string, appealId: string, appealTypeCode: string} }} documentWithAppeal
 * @param {import('express-oauth2-jwt-bearer').JWTPayload} access_token
 * @param {object} id_token
 */
async function checkDocAccess(documentWithAppeal, access_token, id_token) {
	const role = await getRole(documentWithAppeal, access_token, id_token);

	logger.debug(
		{ documentWithAppeal, access_token, id_token },
		`attempt to access document with role: ${role}`
	);

	const canAccess = canAccessBODocument({
		docMetaData: documentWithAppeal,
		role: role
	});

	if (!canAccess) {
		logger.error({ role: role, documentWithAppeal }, 'failed BO doc auth check');
	}

	return canAccess;
}

/**
 * @param {import("@prisma/client").Document & { AppealCase: { LPACode:string, appealId: string} }} documentWithAppeal
 * @param {import('express-oauth2-jwt-bearer').JWTPayload} access_token
 * @param {object} id_token
 */
async function getRole(documentWithAppeal, access_token, id_token) {
	// no token then not a valid request
	if (!access_token) return null;

	// no id token then request without a login
	if (!id_token) return CLIENT_CREDS_ROLE;

	// if token has lpa code then an lpa user
	if (id_token.lpaCode === documentWithAppeal.AppealCase.LPACode) return LPA_USER_ROLE;

	// if we have an lpa then it's the wrong one
	if (id_token.lpaCode) return null;

	// Fetch user roles associated with the appeal
	const appealUserRoles = await repo.getAppealUserRoles({
		appealId: documentWithAppeal.AppealCase.appealId,
		userId: access_token.sub
	});

	// if no roles, user cannot access this document
	if (!appealUserRoles.length) return null;

	// owner role has more permission so takes priority
	const ownerRoles = appealUserRoles?.filter(
		(x) => x.role === APPEAL_USER_ROLES.APPELLANT || x.role === APPEAL_USER_ROLES.AGENT
	);
	if (ownerRoles.length) return ownerRoles[0].role;

	// any other appeal user role
	return appealUserRoles[0].role;
}

/**
 * @type {import('express').Handler}
 */
async function getDocumentUrl(req, res) {
	if (!(await isFeatureActive(FLAG.SERVE_BO_DOCUMENTS))) {
		res.sendStatus(501);
		return;
	}

	const docRef = req.params?.id;

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
