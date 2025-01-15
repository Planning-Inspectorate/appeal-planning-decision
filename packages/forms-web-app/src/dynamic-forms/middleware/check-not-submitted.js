const {
	VIEW: { SELECTED_APPEAL, LPA_DASHBOARD, RULE_6 }
} = require('../../lib/views');
/**
 * @param {string} alreadySubmittedUrl
 * @returns {import('express').Handler}
 */
module.exports = (alreadySubmittedUrl) => (req, res, next) => {
	const journeyResponse = res?.locals?.journeyResponse;

	let userAppealOverview;
	if (req.session?.user?.isLpaUser) {
		userAppealOverview = LPA_DASHBOARD.APPEAL_OVERVIEW;
	} else if (req.session?.user?.isRule6User) {
		userAppealOverview = RULE_6.APPEAL_OVERVIEW;
	} else {
		userAppealOverview = SELECTED_APPEAL.APPEAL_OVERVIEW;
	}

	const redirectPageUrl =
		alreadySubmittedUrl === userAppealOverview
			? `${userAppealOverview}/${journeyResponse.referenceId}`
			: alreadySubmittedUrl;

	if (
		journeyResponse?.answers?.submitted === 'yes' ||
		journeyResponse?.answers?.submitted === true
	) {
		return res.redirect(redirectPageUrl);
	}

	return next();
};
