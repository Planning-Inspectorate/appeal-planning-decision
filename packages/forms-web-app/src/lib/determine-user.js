/**
 * @param {string} url
 * @returns {import("../../../appeals-service-api/src/db/seed/data-static").AppealToUserRoles}
 */
const determineUser = (url) => {
	if (url.includes('/manage-appeals/')) {
		return 'agent';
	} else if (url.includes('/rule-6-appeals/')) {
		return 'rule6Party';
	} else if (url.includes('/appeals/')) {
		return 'appellant';
	} else {
		return 'interestedParty';
	}
};

module.exports = { determineUser };
