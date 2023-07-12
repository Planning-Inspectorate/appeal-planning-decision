const { getUsers } = require('../../lib/appeals-api-wrapper');
const { getLPAUserFromSession } = require('../../services/lpa-user.service');

const {
	VIEW: {
		LPA_DASHBOARD: { DASHBOARD, ADD_REMOVE_USERS, EMAIL_ADDRESS }
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

	const user = getLPAUserFromSession(req);
	const users = await getUsers(user.lpaCode);

	return res.render(ADD_REMOVE_USERS, {
		dashboardUrl: `/${DASHBOARD}`,
		addUserLink: `/${EMAIL_ADDRESS}`,
		successMessage: successMessage,
		users: users
	});
};

module.exports = {
	getAddRemoveUsers
};
