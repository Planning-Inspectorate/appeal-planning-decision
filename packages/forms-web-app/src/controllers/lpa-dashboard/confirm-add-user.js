const {
	VIEW: {
		LPA_DASHBOARD: { CONFIRM_ADD_USER }
	}
} = require('../../lib/views');

const getConfirmAddUser = async (req, res) => {
	return res.render(CONFIRM_ADD_USER, {
		addUserEmailAddress: `${req.session.addUserEmailAddress}`
	});
};

//todo: post controller to add user to db and delete req.session.addUserEmailAddress (aapd-34)

module.exports = {
	getConfirmAddUser
};
