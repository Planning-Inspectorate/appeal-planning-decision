const { getLPAUserFromSession } = require('../../services/lpa-user.service');

const {
	VIEW: {
		LPA_DASHBOARD: { DASHBOARD, ADD_REMOVE_USERS }
	}
} = require('../../lib/views');

const getYourAppeals = async (req, res) => {
	const user = getLPAUserFromSession(req);

	return res.render(DASHBOARD, {
		lpaName: user.lpaName,
		addOrRemoveLink: `/${ADD_REMOVE_USERS}`
	});
};

module.exports = {
	getYourAppeals
};
