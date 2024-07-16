const { getUserFromSession } = require('../../services/user.service');
const {
	VIEW: {
		LPA_DASHBOARD: { CONFIRM_ADD_USER, ADD_REMOVE_USERS }
	}
} = require('../../lib/views');
const logger = require('../../lib/logger');

const getConfirmAddUser = async (req, res) => {
	return res.render(CONFIRM_ADD_USER, {
		addUserEmailAddress: `${req.session.addUserEmailAddress}`
	});
};

const postConfirmAddUser = async (req, res) => {
	const user = getUserFromSession(req);

	try {
		await req.appealsApiClient.createUser({
			email: req.session.addUserEmailAddress,
			isLpaUser: true,
			lpaCode: user.lpaCode
		});
	} catch (e) {
		logger.error(e);
		return res.render(CONFIRM_ADD_USER, {
			addUserEmailAddress: req.session.addUserEmailAddress,
			errors: {},
			errorSummary: [{ text: 'Unable to add user', href: '#' }]
		});
	}

	return res.redirect(`/${ADD_REMOVE_USERS}`);
};

module.exports = {
	getConfirmAddUser,
	postConfirmAddUser
};
