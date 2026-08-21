const config = {
	gitSha: process.env.GIT_SHA ?? 'NO GIT SHA FOUND',
	auth: {
		authServerUrl: process.env.AUTH_BASE_URL
	},
	fileUpload: {
		maxSizeInBytes: Number(process.env.FILE_MAX_SIZE_IN_BYTES || 3145728), // 3MB default
		path: process.env.FILE_UPLOAD_PATH || '/tmp'
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
