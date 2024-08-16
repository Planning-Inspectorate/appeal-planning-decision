// good to go

/**
 * @param {string} alreadySubmittedUrl
 * @returns {import('express').Handler}
 */
module.exports = (alreadySubmittedUrl) => (req, res, next) => {
	const journeyResponse = res?.locals?.journeyResponse;

	if (
		journeyResponse?.answers?.submitted === 'yes' ||
		journeyResponse?.answers?.submitted === true
	) {
		return res.redirect(alreadySubmittedUrl);
	}

	return next();
};
