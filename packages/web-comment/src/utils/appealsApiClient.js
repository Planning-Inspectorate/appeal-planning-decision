const fetch = require('node-fetch');
const { appealsApi } = require('../server.config');

class AppealsApiClient {
	constructor(baseUrl = appealsApi.baseUrl) {
		this.baseUrl = baseUrl;
	}

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

	makeGetRequest(endpoint) {
		return fetch(this.baseUrl + endpoint);
	}

	makePostRequest(endpoint, data) {
		return fetch(this.baseUrl + endpoint, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(data)
		});
	}
}

module.exports = { AppealsApiClient };
