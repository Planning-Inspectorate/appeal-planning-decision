const { APPEAL_USER_ROLES, LPA_USER_ROLE } = require('@pins/common/src/constants');
const { APPEAL_VIRUS_CHECK_STATUS } = require('pins-data-model');

const { getDocType } = require('@pins/common/src/document-types');

exports.CLIENT_CREDS_ROLE = 'client-credentials';

/**
 * @typedef {import('@pins/common/src/document-types').DocType} DocType
 * @typedef {import("@prisma/client").Document & { AppealCase: { LPACode:string, appealId: string, appealTypeCode: string} }} DocMetaData
 * @typedef {function(DocMetaData, DocType): boolean} PermissionsCheck
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
	[exports.CLIENT_CREDS_ROLE]: publicDocAccess // e.g. interested party
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
	return checkAccess(docMetaData, getDocType(docMetaData.documentType, 'dataModelName'));
};
