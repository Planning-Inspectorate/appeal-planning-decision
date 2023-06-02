const config = require('../config');

const checkDebugAllowed = (req, res, next) => {
	if (config.server.allowTestingOverrides) {
		return next();
	}

	res.status(404);
	return res.render('error/not-found');
};

module.exports = checkDebugAllowed;
