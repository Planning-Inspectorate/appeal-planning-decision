const { mapToAppellantDashboardDisplayData } = require('../../lib/dashboard-functions');
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
			appeals = appeals.map(mapToAppellantDashboardDisplayData);
			viewContext = { toDoAppeals: appeals, waitingForReviewAppeals: appeals };
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
