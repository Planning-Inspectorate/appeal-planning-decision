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
	apps: {
		appeals: {
			baseUrl: process.env.APP_APPEALS_BASE_URL
		}
	},
	db: {
		// mongodb: {
		// 	url: process.env.MONGODB_URL,
		// 	dbName: process.env.MONGODB_DB_NAME,
		// 	opts: {
		// 		useNewUrlParser: true,
		// 		useUnifiedTopology: true
		// 	}
		// },
		sql: {
			// todo: different user/login for auth server - different table access
			// don't use the admin connection string for general use
			connectionString: process.env.SQL_CONNECTION_STRING
		}
	},
	featureFlagging: {
		endpoint: process.env.PINS_FEATURE_FLAG_AZURE_ENDPOINT,
		timeToLiveInMinutes: numberWithDefault(process.env.FEATURE_FLAG_CACHE_TIMER, 5)
	},
	logger: {
		level: process.env.LOGGER_LEVEL || 'info',
		prettyPrint: process.env.LOGGER_PRETTY_PRINT === 'true',
		redact: ['config.db', 'config.oidc.options.clients', 'config.services.notify.apiKey']
	},
	server: {
		port: numberWithDefault(process.env.SERVER_PORT, 3000),
		showErrors: process.env.SERVER_SHOW_ERRORS === 'true'
	},
	services: {
		notify: {
			baseUrl: process.env.SRV_NOTIFY_BASE_URL,
			serviceId: process.env.SRV_NOTIFY_SERVICE_ID,
			apiKey: process.env.SRV_NOTIFY_API_KEY,
			templates: {
				APPELLANT_LOGIN: {
					confirmRegistrationEmailToAppellant:
						process.env.SRV_NOTIFY_APPELLANT_LOGIN_CONFIRM_REGISTRATION_TEMPLATE_ID
				}
			}
		}
	},
	oidc
};

export default config;
