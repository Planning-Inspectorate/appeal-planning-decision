/**
 * Build a URL query string with the given query parameters. Includes the ? prefix.
 *
 * @param {Object<string, any>} [params]
 * @returns {string}
 */
function buildQueryString(params = {}) {
	if (Object.keys(params).length === 0) {
		return '';
	}
	const urlParams = new URLSearchParams(params);
	return '?' + urlParams.toString();
}

module.exports = {
	buildQueryString
};
