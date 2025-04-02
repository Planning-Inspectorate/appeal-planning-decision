import { numberWithDefault, getJsonArray } from './config-helpers.js';
import schema from './schema.js';

/** @type {number} */
export const dayInSeconds = 86_400;

const oidcTokenExpiry = numberWithDefault(process.env.OIDC_TOKEN_EXPIRY_SECONDS, dayInSeconds);

const { value, error } = schema.validate({
	gitSha: process.env.GIT_SHA ?? 'NO GIT SHA FOUND',
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
		endpoint: process.env.PINS_FEATURE_FLAG_AZURE_CONNECTION_STRING,
		timeToLiveInMinutes: numberWithDefault(process.env.FEATURE_FLAG_CACHE_TIMER, 5)
	},
	logger: {
		level: process.env.LOGGER_LEVEL || 'info',
		prettyPrint: process.env.LOGGER_PRETTY_PRINT === 'true',
		redact: [
			'config.db',
			'config.oidc.clients.formsWebApp.clientSecret',
			'config.oidc.clients.functions.clientSecret',
			'config.oidc.cookie_keys',
			'config.oidc.jwks',
			'config.services.notify.apiKey'
		]
	},
	oidc: {
		accessTokenFormat: process.env.ACCESS_TOKEN_FORMAT || 'jwt',
		clients: {
			formsWebApp: {
				clientId: process.env.FORMS_WEB_APP_CLIENT_ID,
				clientSecret: process.env.FORMS_WEB_APP_CLIENT_SECRET,
				redirectUris: [process.env.FORMS_WEB_APP_REDIRECT_URI]
			},
			functions: {
				clientId: process.env.FUNCTIONS_CLIENT_ID,
				clientSecret: process.env.FUNCTIONS_CLIENT_SECRET,
				redirectUris: [process.env.FORMS_WEB_APP_REDIRECT_URI] // unused, no user, but required by oidc provider
			}
		},
		cookie_keys: getJsonArray('COOKIE_KEYS', 'string'),
		host: process.env.OIDC_HOST,
		jwks: getJsonArray('JWKS'),
		jwtSigningAlg: process.env.JWT_SIGNING_ALG || 'RS256',
		ttl: {
			AccessToken: numberWithDefault(process.env.TTL_ACCESS_TOKEN, oidcTokenExpiry),
			ClientCredentials: numberWithDefault(process.env.TTL_CLIENT_CREDS, oidcTokenExpiry),
			IdToken: numberWithDefault(process.env.TTL_ID_TOKEN, oidcTokenExpiry),
			Grant: numberWithDefault(process.env.TTL_GRANT, oidcTokenExpiry), // unused
			Interaction: numberWithDefault(process.env.TTL_INTERACTION, oidcTokenExpiry), // unused
			RefreshToken: numberWithDefault(process.env.TTL_REFRESH_TOKEN, oidcTokenExpiry), // unused
			Session: numberWithDefault(process.env.TTL_SESSION, oidcTokenExpiry) // unused
		}
	},
	server: {
		allowTestingOverrides: process.env.ALLOW_TESTING_OVERRIDES === 'true',
		port: numberWithDefault(process.env.SERVER_PORT, 3000),
		proxy: process.env.USES_PROXY !== 'false',
		showErrors: process.env.SERVER_SHOW_ERRORS === 'true',
		tokenExpiry: 1800 // otp email code validity length
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
				},
				generic: process.env.SRV_NOTIFY_FRONT_OFFICE_GENERIC_TEMPLATE_ID
			}
		}
	}
});

if (error) {
	throw new Error(error.message);
}

export const config = value;
export default config;
