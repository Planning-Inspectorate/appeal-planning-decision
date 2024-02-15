import resourceFeature from './resources.js';
import clientList from './clients.js';
import Adapter from '../adapter/prisma-adapter.js';
import Account from '../account/account.js';

const oidc = {
	host: process.env.OIDC_HOST,
	/** @type {import('oidc-provider').Configuration} */
	configuration: {
		clientAuthMethods: ['client_secret_jwt'], //todo: check the one we end up using e.g. 'client_secret_basic', 'client_secret_post'
		clients: clientList,
		claims: { allowed: ['email'] }, // used for opaque token + userinfo endpoint (not currently used)
		features: {
			resourceIndicators: resourceFeature,
			clientCredentials: {
				enabled: true
			},
			devInteractions: {
				enabled: false
			}
			// userinfo: {
			// 	enabled: true
			// },
			// claimsParameter: {
			// 	enabled: true
			// },
			// jwtResponseModes: {
			// 	enabled: true
			// },
			// jwtUserinfo: {
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

oidc.configuration.findAccount = Account.findAccount;
oidc.configuration.adapter = Adapter;

export default oidc;
// WARNING: configuration cookies.keys is missing, this option is critical to detect and ignore tampered cookies
// WARNING: a quick start development-only signing keys are used, you are expected to provide your own in configuration "jwks" property
