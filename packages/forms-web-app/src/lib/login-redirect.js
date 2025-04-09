/**
 * @param {string} basePath
 * @returns {(req: import('express').Request) => void}
 */
const storeAppealPageRedirect = (basePath) => {
	return (req) => {
		let tempBackHistory;

		const urlSegments = req.originalUrl.split('/').filter(Boolean);

		if (
			urlSegments[0] === basePath &&
			urlSegments[1] &&
			urlSegments[1].match(/^\d{7}$/) &&
			urlSegments.length > 2
		) {
			tempBackHistory = `/${urlSegments[0]}/${urlSegments[1]}`;
		}
		if (req.originalUrl.startsWith(`/${basePath}/`) && urlSegments.length > 1) {
			req.session.loginRedirect = req.originalUrl;
			req.session.tempBackLink = tempBackHistory;
		}
	};
};

module.exports = { storeAppealPageRedirect };
