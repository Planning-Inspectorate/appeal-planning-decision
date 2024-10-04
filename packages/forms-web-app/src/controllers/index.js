const config = require('../config');

exports.getIndex = async (_, res) => {
	res.redirect(config.appeals.startingPointEnrolUsersActive);
};
