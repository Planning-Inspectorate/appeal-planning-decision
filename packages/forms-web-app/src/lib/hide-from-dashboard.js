const { createOrUpdateAppeal } = require('#lib/appeals-api-wrapper');

/**
 * Sets flag to hide v1 appeal from dashboard
 * @param {import('express')} req
 * @param {any} appeal
 */
exports.hideFromDashboard = async (req, appeal) => {
	if (!appeal.hideFromDashboard) {
		appeal.hideFromDashboard = true;
		req.session.appeal = await createOrUpdateAppeal(appeal);
	}
};
