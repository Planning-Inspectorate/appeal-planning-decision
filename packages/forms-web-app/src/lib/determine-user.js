/**
 * @param {string} url
 * @returns {import("../../../appeals-service-api/src/db/seed/data-static").AppealToUserRoles}
 */
const determineUser = (url) => {
	/** @type {import("../../../appeals-service-api/src/db/seed/data-static").AppealToUserRoles} */
	let userType = 'interestedParty';

	if (url.includes('/manage-appeals/')) {
		userType = 'agent';
	} else if (url.includes('/rule-6-appeals/')) {
		userType = 'rule6Party';
	} else if (url.includes('/appeals/')) {
		userType = 'appellant';
	}

	return userType;
};

module.exports = { determineUser };
