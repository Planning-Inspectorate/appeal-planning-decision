import resourceFeature from './resources.js';
import clientList from './clients.js';

export default {
	host: process.env.OIDC_HOST,
	/** @type {import('oidc-provider').Configuration} */
	configuration: {
		clientAuthMethods: ['client_secret_jwt'], //todo: check the one we end up using e.g. 'client_secret_basic', 'client_secret_post'
		clients: clientList,
		features: {
			resourceIndicators: resourceFeature,
			clientCredentials: {
				enabled: true
			}
			// claimsParameter: {
			// 	enabled: true
			// },
			// jwtResponseModes: {
			// 	enabled: true
			// },
			// jwtUserinfo: {
			// 	enabled: true
			// },
			// devInteractions: {
			// 	enabled: false
			// },
			// userinfo: {
			// 	enabled: true
			// }
		}
		// todo: set these properly - handle expiry
		// ttl: {
		// 	IdToken: 3600 /* 1 hour in seconds */,
		// 	RefreshToken: 3600 /* 1 hour in seconds */,
		// 	AccessToken: 3600 /* 1 hour in seconds */,
		// 	Interaction: 3600 /* 1 hour in seconds */,
		// 	Session: 1_209_600 /* 14 days in seconds */,
		// 	Grant: 1_209_600 /* 14 days in seconds */
		// }
	}
};
// WARNING: configuration cookies.keys is missing, this option is critical to detect and ignore tampered cookies
// WARNING: a quick start development-only in-memory adapter is used, you MUST change it in order to not lose all stateful provider data upon restart and to be able to share these between processes
// WARNING: a quick start development-only signing keys are used, you are expected to provide your own in configuration "jwks" property
// WARNING: a quick start development-only feature devInteractions is enabled, you are expected to disable these interactions and provide your own
