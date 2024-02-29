import CONSTS from '@pins/common/src/constants.js';
import { isNonEmptyString } from '../../validators/string.js';
import { gty as ropc } from '../../grants/ropc-grant-handler.js';
import { gty as otp } from '../../grants/otp-grant-handler.js';

/**
 * @param {string} name
 * @returns {import('oidc-provider').ClientMetadata}
 */
const buildClient = (name) => {
	/**
	 * @type {import('oidc-provider').ClientMetadata}
	 */
	const client = {
		client_name: name,
		client_id: process.env[name + '_CLIENT_ID'],
		client_secret: process.env[name + '_CLIENT_SECRET'],
		redirect_uris: [process.env[name + '_REDIRECT_URI']],
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

export default [buildClient('FORMS_WEB_APP'), buildClient('WEB_COMMENT')];
