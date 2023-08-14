const { isFeatureActive } = require('../featureFlag');
const { getLPAUserFromSession } = require('../services/lpa-user.service');

const featureFlagMiddleware = (featureFlag, lpaCode) => {
	return async (req, res, next) => {
		if (await isFeatureActive(featureFlag, lpaCode)) {
			next();
		} else {
			return res.status(404).render('error/not-found');
		}
	};
};

const lpaUserFeatureFlagMiddleware = (featureFlag) => {
	return async (req, res, next) => {
		const user = getLPAUserFromSession(req);
		if (await isFeatureActive(featureFlag, user?.lpaCode)) {
			next();
		} else {
			return res.status(404).render('error/not-found');
		}
	};
};

module.exports = {
	featureFlagMiddleware,
	lpaUserFeatureFlagMiddleware
};
