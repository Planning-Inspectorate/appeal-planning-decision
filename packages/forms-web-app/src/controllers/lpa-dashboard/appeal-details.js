const { getLPAUserFromSession } = require('../../services/lpa-user.service');

const {
	VIEW: {
		LPA_DASHBOARD: { DASHBOARD, APPEAL_DETAILS }
	}
} = require('../../lib/views');

const getAppealDetails = async (req, res) => {
	const user = getLPAUserFromSession(req);

	return res.render(APPEAL_DETAILS, {
		lpaName: user.lpaName,
		dashboardLink: `/${DASHBOARD}`
	});
};

module.exports = {
	getAppealDetails
};
