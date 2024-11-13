/**
 * @typedef {import("appeals-service-api").Api.ServiceUser} ServiceUser
 */

const { APPEAL_USER_ROLES } = require('../constants');

/**
 * @param {ServiceUser[]} [users]
 * @returns {string}
 */
const formatApplicant = (users) => {
	const appellant = users?.find((x) => x.serviceUserType === APPEAL_USER_ROLES.APPELLANT);

	if (!appellant) return '';

	return `${appellant.firstName} ${appellant.lastName}`;
};

module.exports = {
	formatApplicant
};
