const {
	mapToAppellantDashboardDisplayData,
	decidedAppeals
} = require('../../../lib/dashboard-functions');
const { VIEW } = require('../../../lib/views');
const logger = require('../../../lib/logger');
const { sortByCaseDecisionDate } = require('@pins/common/src/lib/appeal-sorting');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const { FLAG } = require('@pins/common/src/feature-flags');
const { isFeatureActive } = require('../../../featureFlag');

/**
 * @type {import('express').RequestHandler}
 */
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
			const decidedCases = decidedAppeals(appeals);

			const mappedCases = decidedCases
				.map((a) => mapToAppellantDashboardDisplayData(a, flags))
				.filter(Boolean);

			mappedCases.sort(sortByCaseDecisionDate);
			viewContext = { decidedAppeals: mappedCases };
		}
	} catch (error) {
		logger.error(`Failed to get user decided appeals: ${error}`);
	} finally {
		res.render(VIEW.YOUR_APPEALS.DECIDED_APPEALS, viewContext);
	}
};
