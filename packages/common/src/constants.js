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
	/**
	 * not strictly appeal-user role, there is no link between LPA user and an appeal, it's via the lpa-code on the user and appeal
	 * @type {LpaUserRole}
	 */
	LPA_USER_ROLE: 'lpa-user'
};
