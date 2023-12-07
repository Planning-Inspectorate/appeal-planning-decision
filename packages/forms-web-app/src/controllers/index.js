const config = require('../config');
const { isFeatureActive } = require('../featureFlag');
const { FLAG } = require('@pins/common/src/feature-flags');

exports.getIndex = async (_, res) => {
	const isEnrolUsersActive = await isFeatureActive(FLAG.ENROL_USERS);
	res.redirect(
		isEnrolUsersActive ? config.appeals.startingPointEnrolUsersActive : config.appeals.startingPoint
	);
};
