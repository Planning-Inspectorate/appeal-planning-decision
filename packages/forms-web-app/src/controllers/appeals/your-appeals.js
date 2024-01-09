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
		let appeals = await apiClient.getUserAppealsById(user.id);
		if (appeals?.length > 0) {
			const undecidedAppeals = appeals
				.map(mapToAppellantDashboardDisplayData)
				.filter((appeal) => !appeal.decisionOutcome);

			const { toDoAppeals, waitingForReviewAppeals } = undecidedAppeals.reduce(
				(acc, cur) => {
					if (isToDoAppellantDashboard(cur)) {
						acc.toDoAppeals.push(cur);
					} else {
						acc.waitingForReviewAppeals.push(cur);
					}
					return acc;
				},
				{ toDoAppeals: [], waitingForReviewAppeals: [] }
			);

			toDoAppeals.sort((a, b) => a.nextDocumentDue.dueInDays - b.nextDocumentDue.dueInDays);
			waitingForReviewAppeals.sort((a, b) => a.appealNumber - b.appealNumber);
			viewContext = { toDoAppeals, waitingForReviewAppeals };
		} else {
			viewContext = {
				errorSummary: [{ text: 'There are no associated appeals with this email', href: '#' }]
			};
		}
	} catch (error) {
		logger.error(`Failed to get user appeals: ${error}`);
	} finally {
		res.render(VIEW.APPEALS.YOUR_APPEALS, viewContext);
	}
};
