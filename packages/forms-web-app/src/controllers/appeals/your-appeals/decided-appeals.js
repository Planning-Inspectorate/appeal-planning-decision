const { mapToAppellantDashboardDisplayData } = require('../../../lib/dashboard-functions');
const { VIEW } = require('../../../lib/views');
const logger = require('../../../lib/logger');
const { sortByDateFieldDesc } = require('@pins/common/src/lib/appeal-sorting');

exports.get = async (req, res) => {
	let viewContext = {};
	try {
		const appeals = await req.appealsApiClient.getUserAppeals();
		if (appeals?.length > 0) {
			const decidedAppeals = appeals
				.map(mapToAppellantDashboardDisplayData)
				.filter((appeal) => appeal.appealDecision);
			decidedAppeals.sort(sortByDateFieldDesc('caseDecisionOutcomeDate'));
			viewContext = { decidedAppeals };
		}
	} catch (error) {
		logger.error(`Failed to get user decided appeals: ${error}`);
	} finally {
		res.render(VIEW.YOUR_APPEALS.DECIDED_APPEALS, viewContext);
	}
};
