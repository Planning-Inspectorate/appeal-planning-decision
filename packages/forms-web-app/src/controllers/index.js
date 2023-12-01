const config = require('../config');
const { isFeatureActive } = require('../featureFlag');

exports.getIndex = async (_, res) => {
	const isEnrolUsersActive = await isFeatureActive('enrol-users');
	res.redirect(
		isEnrolUsersActive ? config.appeals.startingPointEnrolUsersActive : config.appeals.startingPoint
	);
};
