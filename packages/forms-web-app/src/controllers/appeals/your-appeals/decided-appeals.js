const { mapToAppellantDashboardDisplayData } = require('../../../lib/dashboard-functions');
const { VIEW } = require('../../../lib/views');
const logger = require('../../../lib/logger');
const { sortByDateFieldDesc } = require('@pins/common/src/lib/appeal-sorting');
const { filterAppealsWithinGivenDate } = require('#lib/filter-decided-appeals');
const { filterTime } = require('../../../config');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const { FLAG } = require('@pins/common/src/feature-flags');
const { isFeatureActive } = require('../../../featureFlag');

exports.get = async (req, res) => {
	let viewContext = {};
	const flags = {
		[FLAG.ADVERT_APPELLANT_STATEMENT_ENABLED]: await isFeatureActive(
			FLAG.ADVERT_APPELLANT_STATEMENT_ENABLED
		)
	};

	try {
		const appeals = await req.appealsApiClient.getUserAppeals(APPEAL_USER_ROLES.APPELLANT);
		if (appeals?.length > 0) {
			const decidedAppeals = appeals
				.map((a) => mapToAppellantDashboardDisplayData(a, flags))
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
