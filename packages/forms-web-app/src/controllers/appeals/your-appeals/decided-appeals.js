const { mapToAppellantDashboardDisplayData } = require('../../../lib/dashboard-functions');
const { VIEW } = require('../../../lib/views');
const logger = require('../../../lib/logger');
const { sortByDateFieldDesc } = require('@pins/common/src/lib/appeal-sorting');
const { filterAppealsWithinGivenDate } = require('#lib/filter-decided-appeals');
const { filterTime } = require('../../../config');

exports.get = async (req, res) => {
	let viewContext = {};
	try {
		const appeals = await req.appealsApiClient.getUserAppeals();
		if (appeals?.length > 0) {
			const decidedAppeals = appeals
				.map(mapToAppellantDashboardDisplayData)
				.filter(Boolean)
				.filter((appeal) => appeal.appealDecision)
				.filter((appeal) =>
					filterAppealsWithinGivenDate(
						appeal,
						'caseDecisionOutcomeDate',
						filterTime.FIVE_YEARS_IN_MILISECONDS
					)
				);
			decidedAppeals.sort(sortByDateFieldDesc('caseDecisionOutcomeDate'));
			viewContext = { decidedAppeals };
		}
	} catch (error) {
		logger.error(`Failed to get user decided appeals: ${error}`);
	} finally {
		res.render(VIEW.YOUR_APPEALS.DECIDED_APPEALS, viewContext);
	}
};
