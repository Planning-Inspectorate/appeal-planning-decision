const escape = require('escape-html');

/**
 * @typedef {import("appeals-service-api").Api.ServiceUser} ServiceUser
 * @typedef {import('@pins/common/src/constants').AppealToUserRoles} AppealToUserRoles
 * @typedef {import('@pins/common/src/constants').LpaUserRole} LpaUserRole
 */

/**
 * @typedef {Object} formattedApplicant
 * @property {object} key
 * @property {object} value
 */

const { APPEAL_USER_ROLES, LPA_USER_ROLE } = require('../constants');

/**
 * @param {ServiceUser[]} [users]
 * @param {AppealToUserRoles|LpaUserRole|null} userType
 * @returns {formattedApplicant}
 */
const formatApplicant = (users, userType = APPEAL_USER_ROLES.INTERESTED_PARTY) => {
	const appellant = users?.find((user) => user.serviceUserType === APPEAL_USER_ROLES.APPELLANT);

	if (userType === LPA_USER_ROLE) {
		const agent = users?.find((user) => user.serviceUserType === APPEAL_USER_ROLES.AGENT);
		if (agent) {
			return {
				key: { text: 'Agent contact details' },
				value: { html: formatContactDetails(agent) }
			};
		}
		if (appellant) {
			return {
				key: { text: 'Appellant contact details' },
				value: { html: formatContactDetails(appellant) }
			};
		}
	}

	if (appellant)
		return {
			key: { text: 'Applicant' },
			value: { text: `${appellant.firstName} ${appellant.lastName}` }
		};

	return { key: { text: 'Applicant' }, value: { text: '' } };
};

/**
 * @param {ServiceUser} [user]
 * @returns {string}
 */
const formatContactDetails = (user) => {
	const name = escape(`${user?.firstName} ${user?.lastName}`);
	const email = escape(user?.emailAddress);
	const telephone = escape(user?.telephoneNumber);
	return [name, email, telephone].filter(Boolean).join('<br>');
};

module.exports = {
	formatApplicant
};
