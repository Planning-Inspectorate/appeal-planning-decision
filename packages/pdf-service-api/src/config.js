const config = {
	gitSha: process.env.GIT_SHA ?? 'NO GIT SHA FOUND',
	auth: {
		authServerUrl: process.env.AUTH_BASE_URL
	},
	logger: {
		level: process.env.LOGGER_LEVEL || 'info'
	},
	server: {
		port: Number(process.env.SERVER_PORT) || 3000,
		showErrors: process.env.SERVER_SHOW_ERRORS === 'true'
	}
};

module.exports = config;
