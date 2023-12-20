const { getUserByEmail, getUserAppealsById } = require('../../../lib/appeals-api-wrapper');
const { mapToAppellantDashboardDisplayData } = require('../../../lib/dashboard-functions');
const { VIEW } = require('../../../lib/views');
const logger = require('../../../lib/logger');

exports.get = async (req, res) => {
	const email = req.session.appeal?.email;
	let viewContext = {};
	try {
		const user = await getUserByEmail(email, true);
		let appeals = await getUserAppealsById(user.id);
		if (appeals?.length > 0) {
			appeals = appeals.map(mapToAppellantDashboardDisplayData);
			viewContext = { appeals };
		}
	} catch (error) {
		logger.error(`Failed to get user decided appeals: ${error}`);
	} finally {
		res.render(VIEW.YOUR_APPEALS.DECIDED_APPEALS, viewContext);
	}
};
