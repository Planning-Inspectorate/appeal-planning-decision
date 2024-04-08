/**
 * @typedef { 'appellant' | 'agent' | 'interestedParty' | 'rule-6-party' } AppealToUserRoles
 * @typedef { 'lpa-user' } LpaUserRole
 */

module.exports = {
	STATUS_CONSTANTS: {
		ADDED: 'added',
		CONFIRMED: 'confirmed',
		REMOVED: 'removed'
	},
	APPEALS_CASE_DATA: {
		APPEAL_TYPE: { HAS: 'Householder (HAS) Appeal', S78: 'Full Planning (S78) Appeal' },
		VALIDITY: { IS_VALID: 'Valid' }
	},
	/**
	 * @type {Record<string, AppealToUserRoles>}
	 */
	APPEAL_USER_ROLES: {
		APPELLANT: 'appellant',
		AGENT: 'agent',
		INTERESTED_PARTY: 'interestedParty',
		RULE_6_PARTY: 'rule-6-party'
	},
	VIRUS_CHECK_STATUSES: {
		CHECKED: 'checked',
		NOT_CHECKED: 'not_checked',
		FAILED: 'failed_virus_check'
	},
	/**
	 * not strictly appeal-user role, there is no link between LPA user and an appeal, it's via the lpa-code on the user and appeal
	 * @type {LpaUserRole}
	 */
	LPA_USER_ROLE: 'lpa-user',
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
