const {
	APPEAL_USER_ROLES,
	LPA_USER_ROLE,
	VIRUS_CHECK_STATUSES
} = require('@pins/common/src/constants');
const { getDocType } = require('@pins/common/src/document-types');

const CLIENT_CREDS_ROLE = 'client-credentials';
module.exports.CLIENT_CREDS_ROLE = CLIENT_CREDS_ROLE;

/**
 * @typedef {import('@pins/common/src/document-types').DocType} DocType
 * @typedef {import('appeals-service-api/index').Schema.Document} DocMetaData
 * @typedef {function(DocMetaData, DocType): boolean} PermissionsCheck
 */

/**
 * @type {PermissionsCheck}
 */
const publicDocAccess = (docMetaData, docType) => {
	if (!docMetaData.published || !docMetaData.redacted) return false;
	if (docType.publiclyAccessible) return true; // todo: set these to true when we know which data model docs appear on public urls
	return false;
};

/**
 * @type {Object<string, PermissionsCheck>}
 */
const docTypeUserMapping = {
	[LPA_USER_ROLE]: (docMetaData, docType) =>
		(docMetaData.published && docMetaData.redacted) || docType.owner === LPA_USER_ROLE,
	[APPEAL_USER_ROLES.APPELLANT]: (docMetaData, docType) =>
		(docMetaData.published && docMetaData.redacted) ||
		docType?.owner === APPEAL_USER_ROLES.APPELLANT,
	[APPEAL_USER_ROLES.AGENT]: (docMetaData, docType) =>
		docTypeUserMapping[APPEAL_USER_ROLES.APPELLANT](docMetaData, docType), // same as appellant
	[APPEAL_USER_ROLES.RULE_6_PARTY]: publicDocAccess, // will this be different from interested party?
	[CLIENT_CREDS_ROLE]: publicDocAccess // e.g. interested party
};

/**
 * @typedef {Object} params
 * @property {DocMetaData} docMetaData - type of the document
 * @property {import('@pins/common/src/constants').AppealToUserRoles | 'client-credentials'} [role] - information about the user, to be fleshed out
 * @param {params} param
 */
module.exports.canAccessBODocument = ({ docMetaData, role }) => {
	// always required to show a back office doc
	if (docMetaData.virusCheckStatus !== VIRUS_CHECK_STATUSES.CHECKED) {
		return false;
	}

	if (!role) return false;

	const checkAccess = docTypeUserMapping[role];
	return checkAccess(docMetaData, getDocType(docMetaData.documentType, 'dataModelName'));
};
