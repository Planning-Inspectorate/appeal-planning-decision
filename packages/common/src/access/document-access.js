module.exports.CLIENT_CREDS_ROLE = 'client-credentials';
const { APPEAL_USER_ROLES, LPA_USER_ROLE } = require('@pins/common/src/constants');
const { APPEAL_VIRUS_CHECK_STATUS } = require('@planning-inspectorate/data-model');

const { getDocType } = require('@pins/common/src/document-types');

/**
 * @typedef {import('@pins/common/src/document-types').DocType} DocType
 * @typedef {import("@prisma/client").Document & { AppealCase: { LPACode:string, appealId: string, appealTypeCode: string} }} DocMetaData
 * @typedef {function(DocMetaData, DocType): boolean|null} PermissionsCheck
 */

/**
 * @type {PermissionsCheck}
 */
const publicDocAccess = (docMetaData, docType) =>
	docMetaData.published && docMetaData.redacted && docType.publiclyAccessible;

/**
 * @type {Object<string, PermissionsCheck>}
 */
const docTypeUserMapping = {
	[LPA_USER_ROLE]: (docMetaData, docType) =>
		(docMetaData.published && docMetaData.redacted) ||
		docType?.owner(docMetaData.AppealCase.appealTypeCode) === LPA_USER_ROLE,
	[APPEAL_USER_ROLES.APPELLANT]: (docMetaData, docType) =>
		(docMetaData.published && docMetaData.redacted) ||
		docType?.owner(docMetaData.AppealCase.appealTypeCode) === APPEAL_USER_ROLES.APPELLANT,
	[APPEAL_USER_ROLES.AGENT]: (docMetaData, docType) =>
		docTypeUserMapping[APPEAL_USER_ROLES.APPELLANT](docMetaData, docType), // same as appellant
	[APPEAL_USER_ROLES.RULE_6_PARTY]: (docMetaData, docType) =>
		(docMetaData.published && docMetaData.redacted) ||
		docType?.owner(docMetaData.AppealCase.appealTypeCode) === APPEAL_USER_ROLES.RULE_6_PARTY,
	[module.exports.CLIENT_CREDS_ROLE]: publicDocAccess // e.g. interested party
};

/**
 * @typedef {Object} params
 * @property {DocMetaData} docMetaData - type of the document
 * @property {import('@pins/common/src/constants').AppealToUserRoles | 'client-credentials'} [role] - information about the user, to be fleshed out
 * @param {params} param
 */
module.exports.canAccessBODocument = ({ docMetaData, role }) => {
	// always required to show a back office doc
	if (docMetaData.virusCheckStatus !== APPEAL_VIRUS_CHECK_STATUS.SCANNED) {
		return false;
	}

	if (!role) return false;

	const checkAccess = docTypeUserMapping[role];

	const docType = getDocType(docMetaData.documentType, 'dataModelName');
	if (!docType) return false;

	return checkAccess(docMetaData, docType);
};

/**
 * @param { Object } params
 * @param {import("pino").BaseLogger } [params.logger]
 * @param {import("@prisma/client").Document & { AppealCase: { LPACode:string, appealId: string, appealTypeCode: string} }} params.documentWithAppeal
 * @param {import("@prisma/client").AppealToUser[]} params.appealUserRoles
 * @param {import('express-oauth2-jwt-bearer').JWTPayload} params.appealUserRoles
 * @param {import('express-oauth2-jwt-bearer').JWTPayload} params.access_token
 * @param {object} params.id_token
 */
module.exports.checkDocAccess = ({
	logger,
	documentWithAppeal,
	appealUserRoles,
	access_token,
	id_token
}) => {
	const role = getRole(documentWithAppeal, appealUserRoles, access_token, id_token);

	if (logger) {
		logger.debug(
			{ documentWithAppeal, access_token, id_token },
			`attempt to access document with role: ${role}`
		);
	}

	const canAccess = exports.canAccessBODocument({
		docMetaData: documentWithAppeal,
		role: role
	});

	if (!canAccess && logger) {
		logger.error({ role: role, documentWithAppeal }, 'failed BO doc auth check');
	}

	return canAccess;
};

/**
 * @param {import("@prisma/client").Document & { AppealCase: { LPACode:string, appealId: string} }} documentWithAppeal
 * @param {import("@prisma/client").AppealToUser[]} appealUserRoles
 * @param {import('express-oauth2-jwt-bearer').JWTPayload} access_token
 * @param {object} id_token
 */
function getRole(documentWithAppeal, appealUserRoles, access_token, id_token) {
	// no token then not a valid request
	if (!access_token) return null;

	// no id token then request without a login
	if (!id_token) return exports.CLIENT_CREDS_ROLE;

	// if token has lpa code then an lpa user
	if (id_token.lpaCode === documentWithAppeal.AppealCase.LPACode) return LPA_USER_ROLE;

	// if we have an lpa then it's the wrong one
	if (id_token.lpaCode) return null;

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
