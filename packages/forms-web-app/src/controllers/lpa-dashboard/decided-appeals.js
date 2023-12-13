const { getLPAUserFromSession } = require('../../services/lpa-user.service');

const {
	VIEW: {
		LPA_DASHBOARD: { DECIDED_APPEALS, DASHBOARD }
	}
} = require('../../lib/views');

const getDecidedAppeals = async (req, res) => {
	const user = getLPAUserFromSession(req);

	return res.render(DECIDED_APPEALS, {
		lpaName: user.lpaName,
		yourAppealsLink: `/${DASHBOARD}`
	});
};

module.exports = {
	getDecidedAppeals
};
