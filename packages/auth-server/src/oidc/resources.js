import consts from '@pins/common/src/constants.js';
import flatten from '@pins/common/src/lib/flattenObjectToDotNotation.js';
import config from '../configuration/config.js';

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
	useGrantedResource: () => false,
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
		return {
			accessTokenFormat: config.oidc.accessTokenFormat,
			jwt: {
				sign: { alg: config.oidc.jwtSigningAlg }
			},
			scope: resources[indicator].scopes.join(' '),
			audience: indicator
		};
	}
};
