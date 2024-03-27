const {
	APPEAL_USER_ROLES,
	LPA_USER_ROLE,
	VIRUS_CHECK_STATUSES
} = require('@pins/common/src/constants');
const documentTypes = require('@pins/common/src/document-types');

/**
 * @typedef {import('appeals-service-api/index').Schema.Document} DocMetaData
 * @typedef {function(DocMetaData, {owner: string}): boolean} PermissionsCheck
 * @type {Object<string, PermissionsCheck>}
 */
const docTypeUserMapping = {
	[LPA_USER_ROLE]: (docMetaData, docType) =>
		docMetaData.published || docType.owner === LPA_USER_ROLE,
	[APPEAL_USER_ROLES.APPELLANT]: (docMetaData, docType) =>
		docMetaData.published || docType?.owner === APPEAL_USER_ROLES.APPELLANT,
	[APPEAL_USER_ROLES.AGENT]: (docMetaData, docType) =>
		docTypeUserMapping[APPEAL_USER_ROLES.APPELLANT](docMetaData, docType),
	[APPEAL_USER_ROLES.INTERESTED_PARTY]: (docMetaData) => docMetaData.published,
	[APPEAL_USER_ROLES.RULE_6_PARTY]: (docMetaData) => docMetaData.published,
	default: () => false // currently not allowing anon calls to access docs
};

/**
 * @typedef {Object} params
 * @property {DocMetaData} docMetaData - type of the document
 * @property {import('@pins/common/src/constants').AppealToUserRoles} [role] - information about the user, to be fleshed out
 * @param {params} param
 */
module.exports.canAccessBODocument = ({ docMetaData, role }) => {
	// always required to show a back office doc
	if (docMetaData.virusCheckStatus !== VIRUS_CHECK_STATUSES.CHECKED || !docMetaData.redacted) {
		return false;
	}

	// don't allow anon access to any doc
	if (!role) return false;

	const checkAccess = docTypeUserMapping[role] || docTypeUserMapping['default'];
	return checkAccess(docMetaData, documentTypes[docMetaData.documentType]);
};
