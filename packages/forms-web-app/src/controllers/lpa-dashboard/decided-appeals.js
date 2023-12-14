const { getLPAUserFromSession } = require('../../services/lpa-user.service');
const { getAppealsCaseDataV2 } = require('../../lib/appeals-api-wrapper');
const { mapToLPADashboardDisplayData } = require('../../lib/dashboard-functions');
const {
	VIEW: {
		LPA_DASHBOARD: { DECIDED_APPEALS, DASHBOARD }
	}
} = require('../../lib/views');

const getDecidedAppeals = async (req, res) => {
	let appealsCaseData = [];

	const user = getLPAUserFromSession(req);

	appealsCaseData = await getAppealsCaseDataV2(user.lpaCode);

	const decidedAppeals = appealsCaseData
		.filter((appeal) => appeal.decision)
		.map(mapToLPADashboardDisplayData);

	decidedAppeals.sort((a, b) => a.caseDecisionDate - b.caseDecisionDate);

	return res.render(DECIDED_APPEALS, {
		lpaName: user.lpaName,
		decidedAppeals: decidedAppeals,
		yourAppealsLink: `/${DASHBOARD}`
	});
};

module.exports = {
	getDecidedAppeals
};
