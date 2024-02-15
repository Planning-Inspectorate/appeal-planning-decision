const tokenLength = 3600; // 1 hour in seconds | todo: how does this play with ttl config settings + setting in grant?
const appeals_fo_resource = 'appeals-front-office';
// todo: get these from env vars?
const resources = {
	[appeals_fo_resource]: {
		name: appeals_fo_resource,
		scopes: [
			// api validators
			'appeals:read',
			'appeals:write',
			'documents:read',
			'documents:write',
			'bo-documents:read',
			// user details requested
			'openid',
			'userinfo',
			'email'
		]
	}
};

/** @typedef {import('oidc-provider').Configuration['features']} features */
/** @type {features['resourceIndicators']} // this import isn't working, why? */
export default {
	enabled: true,
	defaultResource: async () => {
		return appeals_fo_resource;
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
			scope: resources[indicator].scopes.map(({ name }) => name).join(' '),
			audience: indicator
		};
	}
	// Disable the auto use of authorization_code granted resource feature
	// useGrantedResource: () => false,
};
