const { mapToRule6DashboardDisplayData } = require('../../lib/dashboard-functions');
const { VIEW } = require('../../lib/views');
const logger = require('../../lib/logger');
const { sortByDateFieldDesc } = require('@pins/common/src/lib/appeal-sorting');
const { filterAppealsWithinGivenDate } = require('#lib/filter-decided-appeals');
const { filterTime } = require('../../config');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');

exports.getDecidedAppealsR6 = async (req, res) => {
	let viewContext = {};
	try {
		const appeals = await req.appealsApiClient.getUserAppeals(APPEAL_USER_ROLES.RULE_6_PARTY);
		if (appeals?.length > 0) {
			const decidedAppeals = appeals
				.map(mapToRule6DashboardDisplayData)
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
		res.render(VIEW.RULE_6.DECIDED_APPEALS, viewContext);
	}
};