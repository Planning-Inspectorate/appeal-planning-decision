import { numberWithDefault } from './config-helpers.js';

const config = {
	apps: {
		appeals: {
			baseUrl: process.env.APP_APPEALS_BASE_URL
		}
	},
	db: {
		sql: {
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
		redact: ['config.db', 'config.services.notify.apiKey']
	},
	server: {
		allowTestingOverrides: process.env.ALLOW_TESTING_OVERRIDES === 'true',
		port: numberWithDefault(process.env.SERVER_PORT, 3000),
		showErrors: process.env.SERVER_SHOW_ERRORS === 'true',
		tokenExpiry: 1800
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
				},
				SAVE_AND_RETURN: {
					enterCodeIntoServiceEmail:
						process.env.SRV_NOTIFY_SAVE_AND_RETURN_ENTER_CODE_INTO_SERVICE_TEMPLATE_ID
				}
			}
		}
	}
};

export default config;
