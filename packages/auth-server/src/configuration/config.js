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
		redact: ['config.oauth.options.clients'],
		prettyPrint: process.env.LOGGER_PRETTY_PRINT === 'true'
	},
	server: {
		port: numberWithDefault(process.env.SERVER_PORT, 3000),
		showErrors: process.env.SERVER_SHOW_ERRORS === 'true'
	},
	oauth: {
		host: process.env.OIDC_HOST,
		options: {
			clients: [
				{
					name: 'forms-web-app',
					client_id: process.env.FORMS_WEB_APP_CLIENT_ID,
					client_secret: process.env.FORMS_WEB_APP_CLIENT_SECRET,
					redirect_uris: [process.env.FORMS_WEB_APP_REDIRECT_URI]
				}
			]
		}
	}
};

export default config;
