const { getUserFromSession } = require('../../services/user.service');
const { mapToLPADashboardDisplayData } = require('../../lib/dashboard-functions');
const { sortByCaseDecisionDate } = require('@pins/common/src/lib/appeal-sorting');
const { filterAppealsWithinGivenDate } = require('../../lib/filter-decided-appeals');
const { filterTime } = require('../../config');

const {
	VIEW: {
		LPA_DASHBOARD: { DECIDED_APPEALS, DASHBOARD }
	}
} = require('../../lib/views');

const getDecidedAppeals = async (req, res) => {
	const user = getUserFromSession(req);

	const appealsCaseData = await req.appealsApiClient.getDecidedAppealsCaseDataV2(user.lpaCode);

	appealsCaseData.sort(sortByCaseDecisionDate);

	const decidedAppeals = appealsCaseData
		.map(mapToLPADashboardDisplayData)
		.filter((appeal) =>
			filterAppealsWithinGivenDate(
				appeal,
				'caseDecisionOutcomeDate',
				filterTime.FIVE_YEARS_IN_MILISECONDS
			)
		);

	return res.render(DECIDED_APPEALS, {
		lpaName: user.lpaName,
		decidedAppeals: decidedAppeals,
		yourAppealsLink: `/${DASHBOARD}`
	});
};

module.exports = {
	getDecidedAppeals
};
