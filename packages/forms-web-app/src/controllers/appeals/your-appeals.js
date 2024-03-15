const {
	mapToAppellantDashboardDisplayData,
	isToDoAppellantDashboard
} = require('../../lib/dashboard-functions');
const { VIEW } = require('../../lib/views');
const logger = require('../../lib/logger');
const { apiClient } = require('../../lib/appeals-api-client');

exports.get = async (req, res) => {
	const { email } = req.session;
	let viewContext = {};
	try {
		const user = await apiClient.getUserByEmailV2(email);
		const appeals = await apiClient.getUserAppealsById(user.id);

		if (appeals?.length === 0) {
			res.redirect(`/${VIEW.APPEALS.NO_APPEALS}`);
			return;
		}

		const undecidedAppeals = appeals
			.map(mapToAppellantDashboardDisplayData)
			.filter((appeal) => !appeal.appealDecision);

		const { toDoAppeals, waitingForReviewAppeals } = undecidedAppeals.reduce(
			(acc, appeal) => {
				if (isToDoAppellantDashboard(appeal)) {
					acc.toDoAppeals.push(appeal);
				} else {
					acc.waitingForReviewAppeals.push(appeal);
				}
				return acc;
			},
			{ toDoAppeals: [], waitingForReviewAppeals: [] }
		);

		toDoAppeals.sort((a, b) => a.nextDocumentDue.dueInDays - b.nextDocumentDue.dueInDays);
		waitingForReviewAppeals.sort((a, b) => a.appealNumber - b.appealNumber);
		viewContext = { toDoAppeals, waitingForReviewAppeals };

		res.render(VIEW.APPEALS.YOUR_APPEALS, viewContext);
	} catch (error) {
		logger.error(`Failed to get user appeals: ${error}`);
		res.render(VIEW.APPEALS.YOUR_APPEALS, viewContext);
	}
};
