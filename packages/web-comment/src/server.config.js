/**
 *
 * @param {*} value
 * @param {number} fallback
 * @returns {number}
 */
function numberWithDefault(value, fallback) {
	const num = parseInt(value);
	if (isNaN(num)) {
		return fallback;
	}
	return num;
}

const httpPort = numberWithDefault(process.env.PORT, 3000);

module.exports = {
	appealsApi: {
		baseUrl: process.env.APPEALS_SERVICE_API_URL || `http://localhost:3000`,
		timeout: numberWithDefault(process.env.APPEALS_SERVICE_API_TIMEOUT, 10000)
	},
	server: {
		host: process.env.HOST_URL || `http://localhost:${httpPort}`, // This is used for the HTML generator
		port: httpPort,
		// https://expressjs.com/en/5x/api.html#app.set - to account for .gov.uk
		subdomainOffset: numberWithDefault(process.env.SUBDOMAIN_OFFSET, 3)
	}
};
