const { APPEAL_USER_ROLES, LPA_USER_ROLE } = require('@pins/common/src/constants');

/**
 * @typedef {import('@pins/common/src/constants').AppealToUserRoles} AppealToUserRoles
 * @typedef {import('@pins/common/src/constants').LpaUserRole} LpaUserRole
 */

/**
 * @param {string} url
 * @returns {AppealToUserRoles|LpaUserRole|null}
 */
const determineUser = (url) => {
	if (url.includes('/rule-6/')) {
		return APPEAL_USER_ROLES.RULE_6_PARTY;
	} else if (url.includes('/appeals/')) {
		return APPEAL_USER_ROLES.APPELLANT;
	} else if (url.includes('/manage-appeals/')) {
		return LPA_USER_ROLE;
	} else {
		return null;
	}
};

module.exports = { determineUser };
