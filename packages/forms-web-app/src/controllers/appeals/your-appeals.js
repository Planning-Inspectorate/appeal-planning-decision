const {
	mapToAppellantDashboardDisplayData,
	isToDoAppellantDashboard,
	updateChildAppealDisplayData
} = require('../../lib/dashboard-functions');
const { VIEW } = require('../../lib/views');
const logger = require('../../lib/logger');
const { arrayHasItems } = require('@pins/common/src/lib/array-has-items');
const { isNotWithdrawn } = require('@pins/business-rules/src/lib/filter-withdrawn-appeal');
const { isNotTransferred } = require('@pins/business-rules/src/lib/filter-transferred-appeal');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');

exports.get = async (req, res) => {
	let viewContext = {};
	try {
		const appeals = await req.appealsApiClient.getUserAppeals(APPEAL_USER_ROLES.APPELLANT);

		if (appeals?.length === 0) {
			res.redirect(`/${VIEW.APPEALS.NO_APPEALS}`);
			return;
		}

		logger.debug({ appeals }, 'appeals');

		const undecidedAppeals = appeals
			.filter(isNotWithdrawn)
			.filter(isNotTransferred)
			.map(mapToAppellantDashboardDisplayData)
			.filter(Boolean)
			.filter((appeal) => !appeal.appealDecision || appeal.displayInvalid);

		logger.debug({ undecidedAppeals }, 'undecided appeals');

		// aligns child's nextJourneyDue information with lead linked case
		const undecidedWithUpdatedChildAppealDisplayData =
			updateChildAppealDisplayData(undecidedAppeals);

		const { toDoAppeals, waitingForReviewAppeals } =
			undecidedWithUpdatedChildAppealDisplayData.reduce(
				(acc, appeal) => {
					if (isToDoAppellantDashboard(appeal)) {
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

		res.render(VIEW.APPEALS.YOUR_APPEALS, viewContext);
	} catch (error) {
		logger.error(`Failed to get user appeals: ${error}`);
		res.render(VIEW.APPEALS.YOUR_APPEALS, viewContext);
	}
};
