const {
	VIEW: {
		SELECTED_APPEAL: { APPEAL_OVERVIEW }
	}
} = require('../../lib/views');
/**
 * @param {string} alreadySubmittedUrl
 * @returns {import('express').Handler}
 */
module.exports = (alreadySubmittedUrl) => (req, res, next) => {
	const journeyResponse = res?.locals?.journeyResponse;

	const redirectPageUrl =
		alreadySubmittedUrl === APPEAL_OVERVIEW
			? `${alreadySubmittedUrl}/${journeyResponse.referenceId}`
			: alreadySubmittedUrl;

	if (
		journeyResponse?.answers?.submitted === 'yes' ||
		journeyResponse?.answers?.submitted === true
	) {
		return res.redirect(redirectPageUrl);
	}

	return next();
};
