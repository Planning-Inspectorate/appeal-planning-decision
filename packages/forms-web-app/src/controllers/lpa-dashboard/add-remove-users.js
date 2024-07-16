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
			`${req.session.addUserEmailAddress} has been added to the account`,
			'They will receive an email with a link to the service'
		];
		delete req.session.addUserEmailAddress;
	} else if (req.session.removeUserEmailAddress) {
		successMessage = [`${req.session.removeUserEmailAddress} has been removed`];
		delete req.session.removeUserEmailAddress;
	}

	const user = getUserFromSession(req);
	const usersList = await req.appealsApiClient.getUsers(user.lpaCode);

	return res.render(ADD_REMOVE_USERS, {
		dashboardUrl: `/${DASHBOARD}`,
		addUserLink: `/${EMAIL_ADDRESS}`,
		removeUserLink: `/${CONFIRM_REMOVE_USER}`,
		successMessage: successMessage,
		users: usersList
	});
};

module.exports = {
	getAddRemoveUsers
};
