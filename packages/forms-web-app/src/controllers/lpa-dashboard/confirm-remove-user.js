const { getUserById } = require('../../lib/appeals-api-wrapper');
const { getLPAUserFromSession } = require('../../services/lpa-user.service');

const {
	VIEW: {
		LPA_DASHBOARD: { CONFIRM_REMOVE_USER, ADD_REMOVE_USERS }
	}
} = require('../../lib/views');

// todo: handle this via api somehow?
async function checkUserAllowedToRemove(req) {
	const removeUser = await getUserById(req.params.id);
	const user = getLPAUserFromSession(req);

	if (removeUser.lpaCode !== user.lpaCode) {
		throw new Error('Auth: Cannot remove this user');
	}

	return removeUser;
}

const getConfirmRemoveUser = async (req, res) => {
	const removeUser = await checkUserAllowedToRemove(req);

	return res.render(CONFIRM_REMOVE_USER, {
		removeUserEmailAddress: `${removeUser.email}`
	});
};

const postConfirmRemoveUser = async (req, res) => {
	const removeUser = await checkUserAllowedToRemove(req);

	// todo: aapd-13

	req.session.removeUserEmailAddress = removeUser.email;
	return res.redirect(`/${ADD_REMOVE_USERS}`);
};

module.exports = {
	getConfirmRemoveUser,
	postConfirmRemoveUser
};
