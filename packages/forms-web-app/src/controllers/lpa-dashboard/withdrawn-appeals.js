const { getUserFromSession } = require('../../services/user.service');
const {
	mapToLPADashboardDisplayData,
	withdrawnAppeals,
	oldInvalidAppeals
} = require('../../lib/dashboard-functions');
const { sortByWithdrawnDate } = require('@pins/common/src/lib/appeal-sorting');
const logger = require('../../lib/logger');

const {
	VIEW: {
		LPA_DASHBOARD: { WITHDRAWN_APPEALS, DASHBOARD }
	}
} = require('../../lib/views');

const getWithdrawnAppeals = async (req, res) => {
	let viewContext = {
		withdrawnAppeals: [],
		yourAppealsLink: `/${DASHBOARD}`
	};

	try {
		const user = getUserFromSession(req);
		viewContext.lpaName = user.lpaName;

		const appealsCaseData = await req.appealsApiClient.getAppealsCaseDataV2(user.lpaCode);

		const withdrawnCases = withdrawnAppeals(appealsCaseData);
		const oldInvalidatedCases = oldInvalidAppeals(appealsCaseData).map((appeal) => ({
			...appeal,
			caseWithdrawnDate: appeal.caseValidationDate
		}));

		const appealsToDisplay = [...withdrawnCases, ...oldInvalidatedCases]
			.map(mapToLPADashboardDisplayData)
			.filter(Boolean);

		appealsToDisplay.sort(sortByWithdrawnDate);

		viewContext.withdrawnAppeals = appealsToDisplay;

		return res.render(WITHDRAWN_APPEALS, viewContext);
	} catch (error) {
		logger.error(`Failed to get user withdrawn appeals: ${error}`);

		return res.render(WITHDRAWN_APPEALS, viewContext);
	}
};

module.exports = {
	getWithdrawnAppeals
};
