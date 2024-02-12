import { InvalidTarget } from 'oidc-provider/lib/helpers/errors.js';

const tokenLength = 3600; // 1 hour in seconds | todo: how does this play with ttl config settings + setting in grant?

// todo: get these from env vars
const resources = {
	['http://appeals-service-api']: {
		name: 'http://appeals-service-api',
		scopes: ['read', 'write', 'openid', 'name', 'email']
	}
};

/** @typedef {import('oidc-provider').Configuration['features']} features */
/** @type {features['resourceIndicators']} // this import isn't working, why? */
export default {
	enabled: true,
	defaultResource: async () => {
		return '';
	},
	// Disable the auto use of authorization_code granted resource feature
	// useGrantedResource: () => false,
	// eslint-disable-next-line no-unused-vars
	getResourceServerInfo: async (ctx, indicator, client) => {
		const resourceServer = resources[indicator];

		if (!resourceServer) {
			throw new InvalidTarget();
		}

		// todo: lookup from resource list
		const scopes = [
			{ name: 'openid' },
			{ name: 'read' },
			{ name: 'write' },
			{ name: 'email' },
			{ name: 'name' }
		];

		// todo: allow multiple algorithms + key sets?
		return {
			accessTokenFormat: 'jwt',
			jwt: {
				sign: { alg: 'RS256' }
			},
			tokenLength,
			scope: scopes.map(({ name }) => name).join(' ')
		};
	}
};
