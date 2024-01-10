const { getLPAUserFromSession } = require('../../services/lpa-user.service');
const { getDecidedAppealsCaseDataV2 } = require('../../lib/appeals-api-wrapper');
const { mapToLPADashboardDisplayData } = require('../../lib/dashboard-functions');
const { sortByCaseDecisionDate } = require('@pins/common/src/lib/appeal-sorting');

const {
	VIEW: {
		LPA_DASHBOARD: { DECIDED_APPEALS, DASHBOARD }
	}
} = require('../../lib/views');

const getDecidedAppeals = async (req, res) => {
	const user = getLPAUserFromSession(req);

	const appealsCaseData = await getDecidedAppealsCaseDataV2(user.lpaCode);

	const decidedAppeals = appealsCaseData.map(mapToLPADashboardDisplayData);

	decidedAppeals.sort(sortByCaseDecisionDate);

	return res.render(DECIDED_APPEALS, {
		lpaName: user.lpaName,
		decidedAppeals: decidedAppeals,
		yourAppealsLink: `/${DASHBOARD}`
	});
};

module.exports = {
	getDecidedAppeals
};
