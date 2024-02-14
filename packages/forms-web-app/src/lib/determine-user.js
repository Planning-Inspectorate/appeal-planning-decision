const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');

/**
 * @param {string} url
 * @returns {import('@pins/common/src/constants').AppealToUserRoles|null}
 */
const determineUser = (url) => {
	if (url.includes('/rule-6-appeals/')) {
		return APPEAL_USER_ROLES.RULE_6_PARTY;
	} else if (url.includes('/appeals/')) {
		return APPEAL_USER_ROLES.APPELLANT;
	}
	return null;
};

module.exports = { determineUser };
