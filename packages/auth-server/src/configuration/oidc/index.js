import CONSTS from '@pins/common/src/constants.js';
import { numberWithDefault } from '../config-helpers.js';
import { dayInSeconds } from './ttl-defaults.js';
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
		clientAuthMethods: [CONSTS.AUTH.CLIENT_AUTH_METHOD],
		clients: clientList,
		claims: { allowed: ['email'] }, // not currently used, for opaque token + userinfo endpoint
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
			AccessToken: numberWithDefault(process.env.TTL_ACCESS_TOKEN, dayInSeconds),
			ClientCredentials: numberWithDefault(process.env.TTL_CLIENT_CREDS, dayInSeconds),
			IdToken: numberWithDefault(process.env.TTL_ID_TOKEN, dayInSeconds),
			Grant: numberWithDefault(process.env.TTL_GRANT, dayInSeconds), // unused
			Interaction: numberWithDefault(process.env.TTL_INTERACTION, dayInSeconds), // unused
			RefreshToken: numberWithDefault(process.env.TTL_REFRESH_TOKEN, dayInSeconds), // unused
			Session: numberWithDefault(process.env.TTL_SESSION, dayInSeconds) // unused
		}
	}
};

oidc.configuration.findAccount = Account.findAccount;
oidc.configuration.adapter = Adapter;

export default oidc;
