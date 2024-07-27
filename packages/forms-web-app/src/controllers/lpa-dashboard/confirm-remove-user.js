const { getUserFromSession } = require('../../services/user.service');
const logger = require('../../lib/logger');

const {
	VIEW: {
		LPA_DASHBOARD: { CONFIRM_REMOVE_USER, ADD_REMOVE_USERS }
	}
} = require('../../lib/views');

// todo: handle this via api somehow?
async function checkUserAllowedToRemove(req, userToRemove) {
	const user = getUserFromSession(req);

	if (userToRemove.lpaCode !== user.lpaCode) {
		throw new Error('Auth: Cannot remove this user');
	}
}

const getConfirmRemoveUser = async (req, res) => {
	const userToRemove = await req.appealsApiClient.getUserById(req.params.id);

	try {
		await checkUserAllowedToRemove(req, userToRemove);
	} catch (e) {
		logger.error(e);
		return res.render(CONFIRM_REMOVE_USER, {
			removeUserEmailAddress: `${userToRemove.email}`,
			errors: {},
			errorSummary: [{ text: 'Unable to remove user', href: '#' }]
		});
	}

	return res.render(CONFIRM_REMOVE_USER, {
		removeUserEmailAddress: `${userToRemove.email}`
	});
};

const postConfirmRemoveUser = async (req, res) => {
	const userToRemove = await req.appealsApiClient.getUserById(req.params.id);

	try {
		await checkUserAllowedToRemove(req, userToRemove);
		await req.appealsApiClient.removeLPAUser(userToRemove.id);
		req.session.removeUserEmailAddress = userToRemove.email;
	} catch (e) {
		logger.error(e);
		return res.render(CONFIRM_REMOVE_USER, {
			removeUserEmailAddress: `${userToRemove.email}`,
			errors: {},
			errorSummary: [{ text: 'Unable to remove user', href: '#' }]
		});
	}

	return res.redirect(`/${ADD_REMOVE_USERS}`);
};

module.exports = {
	getConfirmRemoveUser,
	postConfirmRemoveUser
};
