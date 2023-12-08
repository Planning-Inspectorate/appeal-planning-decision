const { getLPAUserFromSession } = require('../../services/lpa-user.service');

const {
	VIEW: {
		LPA_DASHBOARD: { DECIDED_APPEALS }
	}
} = require('../../lib/views');

const getDecidedAppeals = async (res, req) => {
	const user = getLPAUserFromSession(req);

	return res.render(DECIDED_APPEALS, {
		lpaName: user.lpaName
	});
};

module.exports = {
	getDecidedAppeals
};
