const { createOrUpdateAppeal, getExistingAppeal } = require('../lib/appeals-api-wrapper');

/**
 * Middleware to ensure any route that needs the appeal form data can have it pre-populated when the
 * controller action is invoked.
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
module.exports = async (req, res, next) => {
	if (req.params?.id) {
		req.session.appeal = await getExistingAppeal(req.params.id);
		return next();
	}

	if (!req.session) {
		return next();
	}

	if (!req.session.appeal || !req.session.appeal.id) {
		req.session.appeal = await createOrUpdateAppeal({});
		return next();
	}

	try {
		req.log.debug({ id: req.session.appeal.id }, 'Get existing appeal');
		req.session.appeal = await getExistingAppeal(req.session.appeal.id);
	} catch (err) {
		req.log.debug({ err }, 'Error retrieving appeal');
		req.session.appeal = await createOrUpdateAppeal({});
	}
	return next();
};
