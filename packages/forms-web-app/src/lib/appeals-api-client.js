const fetch = require('node-fetch');
const config = require('../config');
const v2 = '/api/v2';

/**
 * @class Api Client for v2 urls in appeals-service-api
 */
class AppealsApiClient {
	/**
	 * @param {string|undefined} baseUrl - defaults to config.appeals.url
	 */
	constructor(baseUrl = config.appeals.url) {
		if (!baseUrl) {
			throw new Error('baseUrl is required');
		}

		/** @type {string} */
		this.baseUrl = baseUrl;
	}

	/**
	 * @param {string} email
	 * @param {string} appealSqlId
	 * @param {string} [role]
	 * @returns {Promise<import('appeals-service-api').Api.AppealCaseWithAppellant>}
	 */
	async linkUserToV2Appeal(email, appealSqlId, role) {
		let roleBody;

		if (role) {
			roleBody = {
				body: JSON.stringify({
					role: role
				})
			};
		}

		const endpoint = `${v2}/users/${email}/appeal/${appealSqlId}`;
		const response = await this.#makePostRequest(endpoint, roleBody);
		return response.json();
	}

	/**
	 * @param {string} email
	 * @returns {Promise<import('appeals-service-api').Api.AppealUser>}
	 */
	async getUserByEmailV2(email) {
		const endpoint = `${v2}/users/${email}`;
		const response = await this.#makeGetRequest(endpoint);
		return response.json();
	}

	/**
	 * @param {string} endpoint
	 * @returns {Promise<import('node-fetch').Response>}
	 */
	#makeGetRequest(endpoint) {
		return fetch(this.baseUrl + endpoint);
	}

	/**
	 * @param {string} endpoint
	 * @param {any} data
	 * @returns {Promise<import('node-fetch').Response>}
	 */
	#makePostRequest(endpoint, data) {
		return fetch(this.baseUrl + endpoint, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		});
	}
}

module.exports = { AppealsApiClient };
