const { isFeatureActive } = require('../featureFlag');

const featureFlagMiddleware = (featureFlag, lpaCode) => {
	return async (req, res, next) => {
		if (await isFeatureActive(featureFlag, lpaCode)) {
			next();
		} else {
			return res.status(404).render('error/not-found');
		}
	};
};

module.exports = featureFlagMiddleware;
