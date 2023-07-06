const { getLPA } = require('../../lib/appeals-api-wrapper');
const { getLPAUserFromSession } = require('../../services/lpa-user.service');

const {
	VIEW: {
		LPA_DASHBOARD: { DASHBOARD, ADD_REMOVE_USERS }
	}
} = require('../../lib/views');

const getYourAppeals = async (req, res) => {
	const user = getLPAUserFromSession(req);
	const lpa = await getLPA(user.lpaCode);

	return res.render(DASHBOARD, {
		lpaName: lpa.name,
		addOrRemoveLink: `/${ADD_REMOVE_USERS}`
	});
};

module.exports = {
	getYourAppeals
};
