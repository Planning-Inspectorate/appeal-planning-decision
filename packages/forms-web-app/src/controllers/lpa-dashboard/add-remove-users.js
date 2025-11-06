const { getUserFromSession } = require('../../services/user.service');

const {
	VIEW: {
		LPA_DASHBOARD: { DASHBOARD, ADD_REMOVE_USERS, EMAIL_ADDRESS, CONFIRM_REMOVE_USER }
	}
} = require('../../lib/views');

const getAddRemoveUsers = async (req, res) => {
	let successMessage;
	if (req.session.addUserEmailAddress) {
		successMessage = [
			`${req.session.addUserEmailAddress} added`,
			"We've sent an email with a link to create an account."
		];
		delete req.session.addUserEmailAddress;
	} else if (req.session.removeUserEmailAddress) {
		successMessage = [`${req.session.removeUserEmailAddress} has been removed`];
		delete req.session.removeUserEmailAddress;
	}

	const user = getUserFromSession(req);
	const usersList = await req.appealsApiClient.getUsers(user.lpaCode);
	const userLPAAdmin = usersList.find((user) => user.isLpaAdmin);

	return res.render(ADD_REMOVE_USERS, {
		dashboardUrl: `/${DASHBOARD}`,
		addUserLink: `/${EMAIL_ADDRESS}`,
		removeUserLink: `/${CONFIRM_REMOVE_USER}`,
		successMessage: successMessage,
		users: usersList,
		userLPAAdmin: userLPAAdmin
	});
};

module.exports = {
	getAddRemoveUsers
};
