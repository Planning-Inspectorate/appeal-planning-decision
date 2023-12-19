const { getUserAppealsById, getUserByEmail } = require('../../lib/appeals-api-wrapper');
const { mapToAppellantDashboardDisplayData } = require('../../lib/dashboard-functions');
const { VIEW } = require('../../lib/views');

exports.get = async (req, res) => {
	const { email } = req.session.appeal;
	const user = await getUserByEmail(email, true);
	let appeals = await getUserAppealsById(user.id);
	appeals = appeals.map(mapToAppellantDashboardDisplayData);
	res.render(VIEW.APPEALS.YOUR_APPEALS, { toDoAppeals: appeals, waitingForReviewAppeals: appeals });
};
