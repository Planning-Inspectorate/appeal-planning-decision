const { getUserFromSession } = require('../../services/user.service');
const { mapToLPADashboardDisplayData } = require('../../lib/dashboard-functions');
const { sortByDateFieldDesc } = require('@pins/common/src/lib/appeal-sorting');
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

		const withdrawnAppeals = appealsCaseData
			.filter((appeal) => appeal.caseWithdrawnDate)
			.map(mapToLPADashboardDisplayData)
			.filter(Boolean);

		withdrawnAppeals.sort(sortByDateFieldDesc('caseWithdrawnDate'));

		viewContext.withdrawnAppeals = withdrawnAppeals;

		return res.render(WITHDRAWN_APPEALS, viewContext);
	} catch (error) {
		logger.error(`Failed to get user withdrawn appeals: ${error}`);

		return res.render(WITHDRAWN_APPEALS, viewContext);
	}
};

module.exports = {
	getWithdrawnAppeals
};
