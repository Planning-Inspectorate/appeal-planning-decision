const {
	VIEW: {
		LPA_DASHBOARD: { DASHBOARD, ADD_REMOVE_USERS }
	}
} = require('../../lib/views');

const getYourAppeals = async (req, res) => {
	// todo: use views for link when page built
	return res.render(DASHBOARD, {
		addOrRemoveLink: `/${ADD_REMOVE_USERS}`
	});
};

module.exports = {
	getYourAppeals
};
