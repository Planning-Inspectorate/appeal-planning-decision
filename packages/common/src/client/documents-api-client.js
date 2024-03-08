const { default: fetch } = require('node-fetch');
const crypto = require('crypto');
const { handleApiErrors } = require('./api-client-error');

const parentLogger = require('../lib/logger');

const v2 = '/api/v2';
const trailingSlashRegex = /\/$/;

/**
 * @class Api Client for v2 urls in documents-api
 */
class DocumentsApiClient {
	/**
	 * @param {string} baseUrl - e.g. https://example.com
	 * @param {number} [timeout] - timeout in ms defaults to 1000 (ms)
	 */
	constructor(baseUrl, timeout = 2000) {
		if (!baseUrl) {
			throw new Error('baseUrl is required');
		}

		/** @type {string} */
		this.baseUrl = baseUrl.replace(trailingSlashRegex, '');
		/** @type {number} */
		this.timeout = timeout;
		/** @type {string} */
		this.name = 'Documents API';
	}

	/**
	 * @param {string} blobUrl url
	 * @returns {Promise<any>}
	 */
	async getBackOfficeDocumentSASUrl(blobUrl) {
		const endpoint = `${v2}/back-office/sas-url`;
		const response = await this.#makePostRequest(endpoint, {
			document: blobUrl
		});
		return response.json();
	}

	/**
	 * Handles error responses and timeouts from calls to documents api
	 * @param {string} path endpoint to call e.g. /api/v2/users
	 * @param {'GET'|'POST'|'PUT'|'DELETE'} [method] - request method, defaults to 'GET'
	 * @param {object} [opts] - options to pass to fetch can include request body
	 * @param {object} [headers] - headers to add to request
	 * @returns {Promise<import('node-fetch').Response>}
	 * @throws {ApiClientError|Error}
	 */
	async handler(path, method = 'GET', opts = {}, headers = {}) {
		//todo: can we reuse this handler

		headers = {
			'Content-Type': 'application/json',
			...headers
		};
		const correlationId = crypto.randomUUID();
		const logger = parentLogger.child({
			correlationId,
			service: this.name
		});

		const url = `${this.baseUrl}${path}`;
		logger.debug({ url, method, opts, headers }, this.name);

		// timeout the request
		const controller = new AbortController();
		const timeout = setTimeout(() => {
			controller.abort();
		}, this.timeout);

		let response;
		try {
			response = await fetch(url, {
				method,
				headers,
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
	 * @param {string} endpoint
	 * @param {any} data
	 * @returns {Promise<import('node-fetch').Response>}
	 * @throws {ApiClientError|Error}
	 */
	#makePostRequest(endpoint, data = {}) {
		return this.handler(endpoint, 'POST', {
			body: JSON.stringify(data)
		});
	}
}

module.exports = { DocumentsApiClient };
