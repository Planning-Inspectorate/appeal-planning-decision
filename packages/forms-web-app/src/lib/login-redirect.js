/**
 * @param {string} basePath
 * @param {import('express').Request} req
 */
const storeAppealPageRedirect = (basePath, req) => {
	const urlSegments = req.originalUrl.split('/').filter(Boolean);

	if (req.originalUrl.startsWith(`/${basePath}/`) && urlSegments.length > 1) {
		req.session.loginRedirect = req.originalUrl;
	}
};

module.exports = { storeAppealPageRedirect };
