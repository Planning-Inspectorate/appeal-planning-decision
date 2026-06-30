const {
	mapToAppellantDashboardDisplayData,
	withdrawnAppeals,
	oldInvalidAppeals
} = require('../../../lib/dashboard-functions');
const { VIEW } = require('../../../lib/views');
const logger = require('../../../lib/logger');
const { sortByWithdrawnDate } = require('@pins/common/src/lib/appeal-sorting');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const { FLAG } = require('@pins/common/src/feature-flags');
const { isFeatureActive } = require('../../../featureFlag');

exports.get = async (req, res) => {
	let viewContext = { withdrawnAppeals: [] };
	try {
		const appeals = await req.appealsApiClient.getUserAppeals(APPEAL_USER_ROLES.APPELLANT);

		const flags = {
			[FLAG.ADVERT_APPELLANT_STATEMENT_ENABLED]: await isFeatureActive(
				FLAG.ADVERT_APPELLANT_STATEMENT_ENABLED
			)
		};

		if (appeals?.length > 0) {
			const withdrawnCases = withdrawnAppeals(appeals);
			const oldInvalidatedCases = oldInvalidAppeals(appeals).map((appeal) => ({
				...appeal,
				caseWithdrawnDate: appeal.caseValidationDate
			}));

			const appealsToDisplay = [...withdrawnCases, ...oldInvalidatedCases]
				.sort(sortByWithdrawnDate)
				.map((a) => mapToAppellantDashboardDisplayData(a, flags))
				.filter(Boolean);

			viewContext = { withdrawnAppeals: appealsToDisplay };
		}
	} catch (error) {
		logger.error(`Failed to get user withdrawn appeals: ${error}`);
	} finally {
		res.render(VIEW.YOUR_APPEALS.WITHDRAWN_APPEALS, viewContext);
	}
};
