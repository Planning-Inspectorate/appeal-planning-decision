const {
	mapToRule6DashboardDisplayData,
	isToDoRule6Dashboard
} = require('../../lib/dashboard-functions');
const logger = require('../../lib/logger');
const { arrayHasItems } = require('@pins/common/src/lib/array-has-items');
const { isNotWithdrawn } = require('@pins/common');
const {
	VIEW: {
		RULE_6: { DASHBOARD }
	}
} = require('../../lib/views');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');

const getYourAppealsR6 = async (req, res) => {
	let viewContext = {};
	try {
		const appeals = await req.appealsApiClient.getUserAppeals(APPEAL_USER_ROLES.RULE_6_PARTY);

		// if (appeals?.length === 0) {
		// 	res.redirect(`/${VIEW.APPEALS.NO_APPEALS}`);
		// 	return;
		// }

		logger.debug({ appeals }, 'appeals');

		const undecidedAppeals = appeals
			.filter(isNotWithdrawn)
			.map(mapToRule6DashboardDisplayData)
			.filter(Boolean)
			.filter((appeal) => !appeal.appealDecision);

		logger.debug({ undecidedAppeals }, 'undecided appeals');

		const { toDoAppeals, waitingForReviewAppeals } = undecidedAppeals.reduce(
			(acc, appeal) => {
				if (isToDoRule6Dashboard(appeal)) {
					acc.toDoAppeals.push(appeal);
				} else if (appeal.appealNumber) {
					// don't add draft appeals to waiting for review
					acc.waitingForReviewAppeals.push(appeal);
				}
				return acc;
			},
			{ toDoAppeals: [], waitingForReviewAppeals: [] }
		);

		logger.debug({ toDoAppeals }, 'toDoAppeals');
		logger.debug({ waitingForReviewAppeals }, 'waitingForReviewAppeals');

		toDoAppeals.sort((a, b) => a.nextJourneyDue.dueInDays - b.nextJourneyDue.dueInDays);
		waitingForReviewAppeals.sort((a, b) => a.appealNumber - b.appealNumber);
		const noToDoAppeals = !arrayHasItems(toDoAppeals);

		viewContext = { toDoAppeals, waitingForReviewAppeals, noToDoAppeals };

		res.render(DASHBOARD, viewContext);
	} catch (error) {
		logger.error(`Failed to get user appeals: ${error}`);
		res.render(DASHBOARD, viewContext);
	}
};

module.exports = {
	getYourAppealsR6
};
