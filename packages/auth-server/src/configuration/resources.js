const tokenLength = 3600; // 1 hour in seconds | todo: how does this play with ttl config settings + setting in grant?
import consts from '@pins/common/src/constants.js';
import flatten from '@pins/common/src/lib/flattenObjectToDotNotation.js';

const resources = {
	[consts.AUTH.RESOURCE]: {
		name: consts.AUTH.RESOURCE,
		scopes: Object.values(flatten(consts.AUTH.SCOPES))
	}
};

/** @typedef {import('oidc-provider').Configuration['features']} features */
/** @type {features['resourceIndicators']} // this import isn't working, why? */
export default {
	enabled: true,
	defaultResource: async () => {
		return consts.AUTH.RESOURCE;
	},
	/**
	 * @param {import('oidc-provider').KoaContextWithOIDC} ctx
	 * @param {string} indicator
	 * @param {import('oidc-provider').ClientMetadata} client
	 * @returns {Promise<import('oidc-provider').ResourceServer>}
	 */ // eslint-disable-next-line no-unused-vars
	getResourceServerInfo: async (ctx, indicator, client) => {
		// todo: allow multiple algorithms + key sets?
		return {
			accessTokenFormat: 'jwt',
			jwt: {
				sign: { alg: 'RS256' }
			},
			accessTokenTTL: tokenLength,
			scope: resources[indicator].scopes.join(' '),
			audience: indicator
		};
	}
	// Disable the auto use of authorization_code granted resource feature
	// useGrantedResource: () => false,
};
