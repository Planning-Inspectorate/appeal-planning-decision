const { getUserAppealsById } = require('../../lib/appeals-api-wrapper');
const { mapToAppellantDashboardDisplayData } = require('../../lib/dashboard-functions');
const { VIEW } = require('../../lib/views');

exports.get = async (req, res) => {
	// Update to real user id once id is stored in session on return journey
	let appeals = await getUserAppealsById('29670d0f-c4b4-4047-8ee0-d62b93e91a18');
	appeals = appeals.map(mapToAppellantDashboardDisplayData);
	res.render(VIEW.APPEALS.YOUR_APPEALS, { toDoAppeals: appeals, waitingForReviewAppeals: appeals });
};
