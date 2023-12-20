const httpPort = Number(process.env.PORT || 3000);

module.exports = {
	appealsApi: {
		baseUrl: process.env.APPEALS_SERVICE_API_URL || `http://localhost:3000`,
		timeout: Number(process.env.APPEALS_SERVICE_API_TIMEOUT || 10000)
	},
	server: {
		host: process.env.HOST_URL || `http://localhost:${httpPort}`, // This is used for the HTML generator
		port: httpPort,
		// https://expressjs.com/en/5x/api.html#app.set - to account for .gov.uk
		subdomainOffset: parseInt(process.env.SUBDOMAIN_OFFSET, 10) || 3
	}
};
