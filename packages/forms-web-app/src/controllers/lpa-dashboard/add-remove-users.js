const {
	VIEW: {
		LPA_DASHBOARD: { DASHBOARD, ADD_REMOVE_USERS, EMAIL_ADDRESS }
	}
} = require('../../lib/views');

const getAddRemoveUsers = async (req, res) => {
	return res.render(ADD_REMOVE_USERS, {
		dashboardUrl: `/${DASHBOARD}`,
		addUserLink: `/${EMAIL_ADDRESS}`
	});
};

module.exports = {
	getAddRemoveUsers
};
