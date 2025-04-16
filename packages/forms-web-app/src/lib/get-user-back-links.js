const { VIEW } = require('./views');

/**
 * @param {string} baseUrl
 * @returns {string}
 */
const getUserDashboardLink = (baseUrl) => {
	if (typeof baseUrl !== 'string') {
		throw new Error('baseUrl must be a string');
	}

	if (baseUrl.startsWith('/appeals/')) {
		return `/${VIEW.APPEALS.YOUR_APPEALS}`;
	} else if (baseUrl.startsWith('/manage-appeals/')) {
		return `/${VIEW.LPA_DASHBOARD.DASHBOARD}`;
	} else if (baseUrl.startsWith('/rule-6/')) {
		return `/${VIEW.RULE_6.DASHBOARD}`;
	} else {
		throw new Error(`unknown baseUrl: ${baseUrl}`);
	}
};

/**
 * takes a user back to appeal overview from a subsection
 * @param {string} url
 * @returns {string}
 */
const getParentPathLink = (url) => {
	const urlParts = url.replace(/\/$/, '').split('/');
	urlParts.pop();
	return urlParts.join('/');
};

module.exports = { getUserDashboardLink, getParentPathLink };
