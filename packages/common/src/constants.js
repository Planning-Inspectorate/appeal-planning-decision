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
	AUTH: {
		RESOURCE: 'http://appeals-front-office', // represents all appeals apis, single access token shared between all
		OIDC_ENDPOINT: '/oidc',
		SCOPES: {
			USER_DETAILS: {
				OPENID: 'openid',
				USER_INFO: 'userinfo',
				EMAIL: 'email'
			},
			APPEALS_API: {
				READ: 'appeals:read',
				WRITE: 'appeals:write'
			},
			DOCS_API: {
				READ: 'documents:read',
				WRITE: 'documents:write'
			},
			BO_DOCS_API: {
				READ: 'bo-documents:read'
			}
		}
	}
};
