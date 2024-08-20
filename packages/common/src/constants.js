/**
 * @typedef { 'Appellant' | 'Agent' | 'InterestedParty' | 'Rule6Party' } AppealToUserRoles
 * @typedef { 'LPAUser' } LpaUserRole
 */

const { SERVICE_USER_TYPE } = require('pins-data-model');

module.exports = {
	STATUS_CONSTANTS: {
		ADDED: 'added',
		CONFIRMED: 'confirmed',
		REMOVED: 'removed'
	},
	APPEALS_CASE_DATA: {
		APPEAL_TYPE: { HAS: 'Householder (HAS) Appeal', S78: 'Full Planning (S78) Appeal' },
		APPEAL_TYPE_CODE: { HAS: 'HAS', S78: 'S78' },
		VALIDITY: { IS_VALID: 'Valid' }
	},
	/**
	 * @type {Record<string, AppealToUserRoles>}
	 */
	APPEAL_USER_ROLES: {
		APPELLANT: SERVICE_USER_TYPE.APPELLANT,
		AGENT: SERVICE_USER_TYPE.AGENT,
		INTERESTED_PARTY: 'InterestedParty',
		RULE_6_PARTY: 'Rule6Party'
	},
	EVENT_TYPES: {
		SITE_VISIT: 'siteVisit',
		HEARING: 'hearing',
		INQUIRY: 'inquiry',
		IN_HOUSE: 'inHouse',
		PRE_INQUIRY: 'preInquiry'
	},
	EVENT_SUB_TYPES: {
		ACCOMPANIED: 'accompanied',
		UNACCOMPANIED: 'unaccompanied',
		ACCESS: 'accessRequired',
		VIRTUAL: 'virtual'
	},
	/**
	 * not strictly appeal-user role, there is no link between LPA user and an appeal, it's via the lpa-code on the user and appeal
	 * @type {LpaUserRole}
	 */
	LPA_USER_ROLE: 'LPAUser',
	AUTH: {
		RESOURCE: 'http://appeals-front-office', // represents all appeals apis, single access token shared between all
		OIDC_ENDPOINT: '/oidc',
		JWKS_ENDPOINT: '/oidc/jwks',
		/** @type {import('oidc-provider').ClientAuthMethod} */
		CLIENT_AUTH_METHOD: 'client_secret_post',
		SCOPES: {
			USER_DETAILS: {
				OPENID: 'openid',
				USER_INFO: 'userinfo',
				EMAIL: 'email'
			},
			// APPEALS_API: {
			// 	READ: 'appeals:read',
			// 	WRITE: 'appeals:write'
			// },
			// DOCS_API: {
			// 	READ: 'documents:read',
			// 	WRITE: 'documents:write'
			// },
			BO_DOCS_API: {
				READ: 'bo-documents:read'
			}
		},
		GRANT_TYPE: {
			OTP: 'otp', // one time password grant
			ROPC: 'ropc', // resource owner password grant
			CLIENT_CREDENTIALS: 'client_credentials' // client credentials grant
		}
	}
};
