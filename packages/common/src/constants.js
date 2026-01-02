/**
 * @typedef { 'Appellant' | 'Agent' | 'InterestedParty' | 'Rule6Party' } AppealToUserRoles
 * @typedef { 'LPAUser' } LpaUserRole
 * @typedef {import('@planning-inspectorate/data-model/src/enums').APPEAL_REPRESENTATION_TYPE} AppealRepresentationType
 */

const { APPEAL_REPRESENTATION_TYPE } = require('@planning-inspectorate/data-model');

module.exports = {
	STATUS_CONSTANTS: {
		ADDED: 'added',
		CONFIRMED: 'confirmed',
		REMOVED: 'removed'
	},
	/**
	 * @type {Record<string, AppealToUserRoles>}
	 */
	APPEAL_USER_ROLES: {
		APPELLANT: 'Appellant',
		AGENT: 'Agent',
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
	INTERESTS_IN_LAND: {
		OWNER: 'owner',
		MORTGAGE_LENDER: 'mortgageLender',
		TENANT: 'tenant',
		OTHER: 'other'
	},
	/**
	 * @type {Record<string, AppealRepresentationType>}
	 */
	REPRESENTATION_TYPES: {
		STATEMENT: APPEAL_REPRESENTATION_TYPE.STATEMENT,
		INTERESTED_PARTY_COMMENT: APPEAL_REPRESENTATION_TYPE.COMMENT,
		FINAL_COMMENT: APPEAL_REPRESENTATION_TYPE.FINAL_COMMENT,
		PROOFS_OF_EVIDENCE: APPEAL_REPRESENTATION_TYPE.PROOFS_EVIDENCE
	},
	STATEMENT_TYPE: {
		LPA: 'lpa',
		RULE_6: 'rule6'
	},
	SUBMISSIONS: {
		CONTINUE: 'Continue',
		INVALID: 'Invalid',
		QUESTIONNAIRE: 'Questionnaire',
		STATEMENT: 'Statement',
		FINAL_COMMENT: 'Final comments',
		PROOFS_EVIDENCE: 'Proofs of evidence'
	},
	/**
	 * not strictly appeal-user role, there is no link between LPA user and an appeal, it's via the lpa-code on the user and appeal
	 * @type {LpaUserRole}
	 */
	LPA_USER_ROLE: 'LPAUser',
	TEST_LPA_CODES: {
		Q9999: 'Q9999',
		Q1111: 'Q1111'
	},
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
				EMAIL: 'email',
				LPA: 'lpa'
			}
		},
		GRANT_TYPE: {
			OTP: 'otp', // one time password grant
			ROPC: 'ropc', // resource owner password grant
			CLIENT_CREDENTIALS: 'client_credentials' // client credentials grant
		}
	}
};
