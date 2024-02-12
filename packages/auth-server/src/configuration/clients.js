import { gty } from '../lib/ropc-grant-handler.js';

/**
 * @param {*} val
 * @returns {boolean}
 */
function isNonEmptyString(val) {
	return typeof val === 'string' && val.trim() !== '';
}

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
		redirect_uris: [
			process.env[name + '_REDIRECT_URI'],
			'http://localhost:9003/debug/oidc',
			'http://localhost:9003/debug/log'
		],
		grant_types: ['client_credentials', 'authorization_code', gty],
		token_endpoint_auth_method: 'client_secret_jwt'
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

export default [buildClient('FORMS_WEB_APP')]; //todo: client names from env var list
