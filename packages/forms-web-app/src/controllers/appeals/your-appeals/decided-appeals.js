const { mapToAppellantDashboardDisplayData } = require('../../../lib/dashboard-functions');
const { VIEW } = require('../../../lib/views');
const logger = require('../../../lib/logger');
const { apiClient } = require('../../../lib/appeals-api-client');
const { sortByDateFieldDesc } = require('@pins/common/src/lib/appeal-sorting');

exports.get = async (req, res) => {
	const { email } = req.session;
	let viewContext = {};
	try {
		const user = await apiClient.getUserByEmailV2(email);
		const appeals = await apiClient.getUserAppealsById(user.id);
		if (appeals?.length > 0) {
			const decidedAppeals = appeals
				.map(mapToAppellantDashboardDisplayData)
				.filter((appeal) => appeal.decisionOutcome);
			decidedAppeals.sort(sortByDateFieldDesc('caseDecisionDate'));
			viewContext = { decidedAppeals };
		}
	} catch (error) {
		logger.error(`Failed to get user decided appeals: ${error}`);
	} finally {
		res.render(VIEW.YOUR_APPEALS.DECIDED_APPEALS, viewContext);
	}
};
