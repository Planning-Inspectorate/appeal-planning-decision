const {
	mapToAppellantDashboardDisplayData,
	isToDoAppellantDashboard
} = require('../../lib/dashboard-functions');
const { VIEW } = require('../../lib/views');
const logger = require('../../lib/logger');
const { apiClient } = require('../../lib/appeals-api-client');
const { determineUser } = require('#lib/determine-user');

/**
 * @typedef {import('../../lib/dashboard-functions').DashboardDisplayData} DashboardDisplayData
 */

/** @type {import('express').Handler} */
exports.get = async (req, res) => {
	const { email } = req.session;
	let viewContext = {};
	try {
		const user = await apiClient.getUserByEmailV2(email);
		const appeals = await apiClient.getUserAppealsById(user.id);
		const userType = determineUser(req.originalUrl);

		if (appeals?.length === 0) {
			res.redirect(`/${VIEW.APPEALS.NO_APPEALS}`);
			return;
		}

		/** @type {{ toDoAppeals: DashboardDisplayData[], waitingForReviewAppeals: DashboardDisplayData[] }} */
		const initialDisplayData = { toDoAppeals: [], waitingForReviewAppeals: [] };
		const { toDoAppeals, waitingForReviewAppeals } = appeals.reduce((acc, appeal) => {
			const dashboardData = mapToAppellantDashboardDisplayData(appeal, userType);
			if (dashboardData.appealDecision) {
				return acc;
			}
			if (isToDoAppellantDashboard(dashboardData)) {
				acc.toDoAppeals.push(dashboardData);
			} else {
				acc.waitingForReviewAppeals.push(dashboardData);
			}
			return acc;
		}, initialDisplayData);
		console.log(
			'🚀 ~ const{toDoAppeals,waitingForReviewAppeals}=appeals.reduce ~ dashboardData:',
			waitingForReviewAppeals[0]
		);

		toDoAppeals.sort(
			(a, b) => (a.nextDocumentDue.dueInDays ?? 0) - (b.nextDocumentDue.dueInDays ?? 0)
		);
		waitingForReviewAppeals.sort();
		viewContext = { toDoAppeals, waitingForReviewAppeals };

		res.render(VIEW.APPEALS.YOUR_APPEALS, viewContext);
	} catch (error) {
		logger.error(`Failed to get user appeals: ${error}`);
		res.render(VIEW.APPEALS.YOUR_APPEALS, viewContext);
	}
};
