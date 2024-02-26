import resourceFeature from './resources.js';
import clientList from './clients.js';
import Adapter from '../../adapter/prisma-adapter.js';
import Account from '../../account/account.js';
import logger from '../../lib/logger.js';

let cookie_keys;
try {
	cookie_keys = JSON.parse(process.env.COOKIE_KEYS);
	cookie_keys.forEach((x) => {
		if (typeof x !== 'string') {
			throw new Error('cookies.keys must be an array of strings');
		}
	});
} catch (err) {
	logger.warn({ err });
	cookie_keys = [process.env.COOKIE_KEYS];
}

let jwks;
try {
	jwks = JSON.parse(process.env.JWKS);
	if (!Array.isArray(jwks)) {
		throw new Error('jwks must be a json array');
	}
} catch (err) {
	logger.warn({ err }, 'invalid jwks array');
	throw err;
}

const oidc = {
	host: process.env.OIDC_HOST,
	/** @type {import('oidc-provider').Configuration} */
	configuration: {
		clientAuthMethods: ['client_secret_post'], //todo: check the one we end up using e.g. 'client_secret_basic', 'client_secret_post', 'client_secret_jwt
		clients: clientList,
		claims: { allowed: ['email'] }, // used for opaque token + userinfo endpoint (not currently used)
		cookies: {
			keys: cookie_keys
		},
		jwks: {
			keys: jwks
		},
		features: {
			resourceIndicators: resourceFeature,
			clientCredentials: {
				enabled: true
			},
			devInteractions: {
				enabled: false
			}
		},
		ttl: {
			ClientCredentials: 86400 /* 24 hours in seconds */,
			IdToken: 86400 /* 24 hours in seconds */,
			RefreshToken: 86400 /* 24 hours in seconds */,
			AccessToken: 86400 /* 24 hours in seconds */,
			Interaction: 86400 /* 24 hours in seconds */,
			Session: 1_209_600 /* 14 days in seconds */,
			Grant: 1_209_600 /* 14 days in seconds */
		}
	}
};

oidc.configuration.findAccount = Account.findAccount;
oidc.configuration.adapter = Adapter;

export default oidc;
