import CONSTS from '@pins/common/src/constants.js';
import config from '../configuration/config.js';
import resourceFeature from './resources.js';
import { buildClient } from './clients.js';

const oidc = {
	host: config.oidc.host,
	/** @type {import('oidc-provider').Configuration} */
	configuration: {
		clientAuthMethods: [CONSTS.AUTH.CLIENT_AUTH_METHOD],
		clients: [
			buildClient({
				name: 'FORMS_WEB_APP',
				id: config.oidc.clients.formsWebApp.clientId,
				secret: config.oidc.clients.formsWebApp.clientSecret,
				redirects: config.oidc.clients.formsWebApp.redirectUris
			}),
			buildClient({
				name: 'INTEGRATION_FUNCTIONS',
				id: config.oidc.clients.functions.clientId,
				secret: config.oidc.clients.functions.clientSecret,
				redirects: config.oidc.clients.functions.redirectUris
			})
		],
		claims: { allowed: ['email'] }, // not currently used, for opaque token + userinfo endpoint
		cookies: {
			keys: config.oidc.cookie_keys
		},
		jwks: {
			keys: config.oidc.jwks
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
		ttl: config.oidc.ttl
	}
};

export default oidc;
