const { handleApiErrors, ApiClientError } = require('../api-client-error');
const parentLogger = require('../../lib/logger');

const v2 = '/api/v2';
const trailingSlashRegex = /\/$/;

/**
 * @class Api Client for bops
 */
class BopsApiClient {
	/**
	 * @param {string} baseUrl - e.g. https://example.com
	 * @param {boolean} [allowTestingOverrides]
	 * @param {string} [access_token]
	 * @param {number} [timeout] - timeout in ms defaults to 2000 (ms)
	 */
	constructor(baseUrl, allowTestingOverrides = false, access_token = undefined, timeout = 2000) {
		if (!baseUrl) {
			throw new Error('baseUrl is required');
		}

		/** @type {string} */
		this.baseUrl = baseUrl.replace(trailingSlashRegex, '');
		/** @type {boolean} */
		this.allowTestingOverrides = allowTestingOverrides;
		/** @type {string|undefined} */
		this.access_token = access_token;
		/** @type {number} */
		this.timeout = timeout;
		/** @type {string} */
		this.name = 'BOPS API';
	}

	/**
	 * @param {string} reference
	 * @returns {Promise<Document>}
	 */
	async getPublicApplication(reference) {
		if (this.allowTestingOverrides) {
			switch (reference) {
				case 'HH-REFUSED': {
					const householderRefused = require('./examples/application-householder-refused.json');
					householderRefused.application.determinedAt = new Date().toISOString();
					return householderRefused;
				}
				case 'HH-GRANTED': {
					const householderGranted = require('./examples/application-householder-granted.json');
					householderGranted.application.determinedAt = new Date().toISOString();
					return householderGranted;
				}
				case 'HH-NODECISION': {
					const householderNoDecision = require('./examples/application-householder-no-decision.json');
					householderNoDecision.application.expiryDate = new Date().toISOString();
					return householderNoDecision;
				}
			}
		}

		const endpoint = `${v2}/public/planning_applications/${reference}`;
		const response = await this.#makeGetRequest(endpoint);
		return response.json();
	}

	/**
	 * Handles error responses and timeouts from calls to appeals api
	 * @param {string} path endpoint to call e.g. /api/v2/users
	 * @param {'GET'|'POST'|'PUT'|'DELETE'|'PATCH'} [method] - request method, defaults to 'GET'
	 * @param {RequestInit} [opts] - options to pass to fetch can include request body
	 * @param {HeadersInit} [headers] - headers to add to request
	 * @returns {Promise<Response>}
	 * @throws {ApiClientError|Error}
	 */
	async handler(path, method = 'GET', opts = {}, headers = {}) {
		headers = this.#addAuthHeaders({
			...headers
		});
		const correlationId = crypto.randomUUID();
		const url = `${this.baseUrl}${path}`;

		const logger = parentLogger.child({
			correlationId,
			service: this.name
		});

		logger.debug({ url, method, opts, headers }, `${this.name} call`);

		// timeout the request
		const controller = new AbortController();
		const timeout = setTimeout(() => {
			controller.abort();
		}, this.timeout);

		let response;
		try {
			response = await fetch(url, {
				method,
				headers: {
					'Content-Type': 'application/json',
					...headers
				},
				...opts,
				signal: controller.signal
			});
		} catch (error) {
			if (error.name === 'AbortError') {
				logger.error(error, this.name + ' error: timeout');
			} else {
				logger.error(error, this.name + ' error: unhandled fetch error');
			}

			throw error;
		} finally {
			clearTimeout(timeout);
		}

		if (response.ok) {
			return response; // allow caller to handle ok response
		}

		return await handleApiErrors(response, logger, this.name);
	}

	/**
	 * @param {HeadersInit} headers - headers to add to request
	 * @returns {HeadersInit}
	 */
	#addAuthHeaders(headers) {
		if (this.access_token) {
			headers['Authorization'] = 'Bearer ' + this.access_token;
		}

		return headers;
	}

	/**
	 * @param {string} endpoint
	 * @returns {Promise<Response>}
	 * @throws {ApiClientError|Error}
	 */
	#makeGetRequest(endpoint) {
		return this.handler(endpoint);
	}
}

module.exports = { BopsApiClient, ApiClientError };
