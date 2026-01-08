const { mapToRule6DashboardDisplayData } = require('../../lib/dashboard-functions');
const { VIEW } = require('../../lib/views');
const logger = require('../../lib/logger');
const { filterAppealsWithinGivenDate } = require('../../lib/filter-decided-appeals');
const { filterTime } = require('../../config');
const { sortByDateFieldDesc } = require('@pins/common/src/lib/appeal-sorting');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');

exports.get = async (req, res) => {
	let viewContext = { withdrawnAppeals: [] };
	try {
		const appeals = await req.appealsApiClient.getUserAppeals(APPEAL_USER_ROLES.RULE_6_PARTY);

		if (appeals?.length > 0) {
			const withdrawnAppeals = appeals
				.filter((appeal) => appeal.caseWithdrawnDate)
				.map(mapToRule6DashboardDisplayData)
				.filter(Boolean)
				.filter((appeal) =>
					filterAppealsWithinGivenDate(
						appeal,
						'caseWithdrawnDate',
						filterTime.FIVE_YEARS_IN_MILISECONDS
					)
				);

			withdrawnAppeals.sort(sortByDateFieldDesc('caseWithdrawnDate'));
			viewContext = { withdrawnAppeals };
		}
	} catch (error) {
		logger.error(`Failed to get Rule 6 withdrawn appeals: ${error}`);
	} finally {
		res.render(VIEW.RULE_6.WITHDRAWN_APPEALS, viewContext);
	}
};
