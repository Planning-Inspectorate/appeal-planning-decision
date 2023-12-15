const { getUserByEmail, getUserAppealsById } = require('../../../lib/appeals-api-wrapper');
const { mapToAppellantDashboardDisplayData } = require('../../../lib/dashboard-functions');
const { VIEW } = require('../../../lib/views');

exports.get = async (req, res) => {
	const { email } = req.session;
	const user = await getUserByEmail(email, true);
	let appeals = await getUserAppealsById(user.id);
	appeals = appeals.map(mapToAppellantDashboardDisplayData).filter((item) => item.decisionOutcome);
	res.render(VIEW.YOUR_APPEALS.DECIDED_APPEALS, { appeals });
};
