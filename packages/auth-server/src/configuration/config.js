import oidc from './oidc-config.js';

/**
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

const config = {
	logger: {
		level: process.env.LOGGER_LEVEL || 'info',
		prettyPrint: process.env.LOGGER_PRETTY_PRINT === 'true',
		redact: ['config.oidc.options.clients']
	},
	server: {
		port: numberWithDefault(process.env.SERVER_PORT, 3000),
		showErrors: process.env.SERVER_SHOW_ERRORS === 'true'
	},
	oidc
};

export default config;
