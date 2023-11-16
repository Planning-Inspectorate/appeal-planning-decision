const httpPort = Number(process.env.PORT || 3000);

module.exports = {
	server: {
		host: process.env.HOST_URL || `http://localhost:${httpPort}`, // This is used for the HTML generator
		port: httpPort,
		// https://expressjs.com/en/5x/api.html#app.set - to account for .gov.uk
		subdomainOffset: parseInt(process.env.SUBDOMAIN_OFFSET, 10) || 3
	}
};
