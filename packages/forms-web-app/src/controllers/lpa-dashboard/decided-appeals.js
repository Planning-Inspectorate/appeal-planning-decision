const { getLPAUserFromSession } = require('../../services/lpa-user.service');
const { getDecidedAppealsCaseDataV2 } = require('../../lib/appeals-api-wrapper');
const { mapToLPADecidedData } = require('../../lib/dashboard-functions');

const {
	VIEW: {
		LPA_DASHBOARD: { DECIDED_APPEALS, DASHBOARD }
	}
} = require('../../lib/views');

const getDecidedAppeals = async (req, res) => {
	const user = getLPAUserFromSession(req);

	const appealsCaseData = await getDecidedAppealsCaseDataV2(user.lpaCode);

	const decidedAppeals = appealsCaseData.map(mapToLPADecidedData);

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
