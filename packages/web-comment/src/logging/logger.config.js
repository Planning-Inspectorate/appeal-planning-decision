module.exports = {
	logger: {
		level: process.env.LOGGER_LEVEL || 'info',
		redact: ['opts.body', 'config.db.session.uri', 'config.server.sessionSecret']
	}
};
