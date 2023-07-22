const { getLPAUserFromSession } = require('../../services/lpa-user.service');

const {
	VIEW: {
		LPA_DASHBOARD: { DASHBOARD, ADD_REMOVE_USERS }
	}
} = require('../../lib/views');

const { getAppealsCaseData } = require('../../lib/appeals-api-wrapper');

const getYourAppeals = async (req, res) => {
	let appealsCaseData = [];

	const user = getLPAUserFromSession(req);

	// eslint-disable-next-line no-unused-vars
	appealsCaseData = await getAppealsCaseData(user.lpaCode);

	return res.render(DASHBOARD, {
		lpaName: user.lpaName,
		addOrRemoveLink: `/${ADD_REMOVE_USERS}`
	});
};

module.exports = {
	getYourAppeals
};
