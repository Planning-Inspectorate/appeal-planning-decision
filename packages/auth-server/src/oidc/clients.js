import CONSTS from '@pins/common/src/constants.js';
import { isNonEmptyString } from '../validators/string.js';
import { gty as ropc } from '../grants/ropc-grant-handler.js';
import { gty as otp } from '../grants/otp-grant-handler.js';

/**
 * @param {Object} options
 * @param {string} options.name
 * @param {string} options.id
 * @param {string} options.secret
 * @param {Array<string>} options.redirects
 * @returns {import('oidc-provider').ClientMetadata}
 */
export const buildClient = ({ name, id, secret, redirects }) => {
	/**
	 * @type {import('oidc-provider').ClientMetadata}
	 */
	const client = {
		client_name: name,
		client_id: id,
		client_secret: secret,
		redirect_uris: redirects,
		grant_types: ['client_credentials', 'authorization_code', otp, ropc],
		token_endpoint_auth_method: CONSTS.AUTH.CLIENT_AUTH_METHOD
	};

	if (
		!isNonEmptyString(client.client_id) ||
		!isNonEmptyString(client.client_secret) ||
		!isNonEmptyString(client.redirect_uris[0])
	) {
		throw new Error(`invalid client: ${client.client_name}`);
	}

	return client;
};
