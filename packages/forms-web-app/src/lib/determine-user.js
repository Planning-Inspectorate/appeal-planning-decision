const { APPEAL_USER_ROLES, LPA_USER_ROLE } = require('@pins/common/src/constants');

/**
 * @param {string} url
 * @returns {import('@pins/common/src/constants').AppealToUserRoles|string|null}
 */
const determineUser = (url) => {
	if (url.includes('/rule-6-appeals/')) {
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
