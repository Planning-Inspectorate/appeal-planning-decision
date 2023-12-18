const fetch = require('node-fetch');
const { appealsApi } = require('../server.config');

class AppealsApiClient {
	constructor(baseUrl = appealsApi.baseUrl) {
		this.baseUrl = baseUrl;
	}

	/**
	 * @param {Object<string, any>} params
	 * @returns {Promise<any[]>} // todo: use exported API types
	 */
	async getPostcodeSearchResults(params = {}) {
		const urlParams = new URLSearchParams();
		for (let key in params) {
			urlParams.append(key, params[key]);
		}

		const endpoint = urlParams.toString()
			? '/api/v2/appeal-cases?' + urlParams.toString()
			: '/api/v2/appeal-cases';

		const result = await this.makeGetRequest(endpoint);
		return result.json();
	}

	/**
	 * @param {string} endpoint
	 * @returns {any}
	 */
	makeGetRequest(endpoint) {
		return fetch(this.baseUrl + endpoint);
	}

	/**
	 * @param {string} endpoint
	 * @param {any} data
	 * @returns {any}
	 */
	makePostRequest(endpoint, data) {
		return fetch(this.baseUrl + endpoint, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		});
	}
}

module.exports = { AppealsApiClient };
