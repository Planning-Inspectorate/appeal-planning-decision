const { default: fetch } = require('node-fetch');
const crypto = require('crypto');
const { handleApiErrors } = require('./api-client-error');

const parentLogger = require('../lib/logger');

const v2 = '/api/v2';
const trailingSlashRegex = /\/$/;

/**
 * @typedef {{access_token: string, id_token: string, client_creds: string}} AuthTokens
 * @typedef {{url: string}} SasUrl
 */

/**
 * @class Api Client for urls in documents-api
 * todo: get appeal pdf copy, upload submissions
 */
class DocumentsApiClient {
	/**
	 * @param {string} baseUrl - e.g. https://example.com
	 * @param {AuthTokens} [tokens]
	 * @param {number} [timeout] - timeout in ms defaults to 1000 (ms)
	 */
	constructor(baseUrl, tokens, timeout = 2000) {
		if (!baseUrl) {
			throw new Error('baseUrl is required');
		}

		/** @type {string} */
		this.baseUrl = baseUrl.replace(trailingSlashRegex, '');
		/** @type {AuthTokens|undefined} */
		this.tokens = tokens;
		/** @type {number} */
		this.timeout = timeout;
		/** @type {string} */
		this.name = 'Documents API';
	}

	/**
	 * @param {string} publishedDocumentId
	 * @returns {Promise<SasUrl>}
	 */
	async getBackOfficeDocumentSASUrl(publishedDocumentId) {
		const endpoint = `${v2}/back-office/${publishedDocumentId}`;
		const response = await this.#makeGetRequest(endpoint);
		return response.json();
	}

	/**
	 * @param {string} caseRef
	 * @param {string} caseStage
	 * @param {string} documentsLocation
	 * @returns {Promise<Buffer>}
	 */
	async getBulkDocumentsDownload(caseRef, caseStage, documentsLocation) {
		const endpoint = `${v2}/${documentsLocation}/${caseRef}/case-stage/${caseStage}`;
		const response = await this.#makeGetRequest(endpoint);
		return response.buffer();
	}

	/**
	 * @param {string} submissionDocumentId id
	 * @returns {Promise<SasUrl>}
	 */
	async getSubmissionDocumentSASUrl(submissionDocumentId) {
		const endpoint = `${v2}/submission-document/${submissionDocumentId}`;
		const response = await this.#makeGetRequest(endpoint);
		return response.json();
	}

	/**
	 * @param {string} submissionDocumentId id
	 * @returns {Promise<void>}
	 */
	async deleteSubmissionDocument(submissionDocumentId) {
		const endpoint = `${v2}/submission-document/${submissionDocumentId}`;
		await this.#makeDeleteRequest(endpoint);
	}

	/**
	 * Handles error responses and timeouts from calls to documents api
	 * @param {string} path endpoint to call e.g. /api/v2/users
	 * @param {'GET'|'POST'|'PUT'|'DELETE'} [method] - request method, defaults to 'GET'
	 * @param {import('node-fetch').RequestInit} [opts] - options to pass to fetch can include request body
	 * @param {import('node-fetch').HeadersInit} [headers] - headers to add to request
	 * @returns {Promise<import('node-fetch').Response>}
	 * @throws {ApiClientError|Error}
	 */
	async handler(path, method = 'GET', opts = {}, headers = {}) {
		//todo: can we reuse this handler

		headers = this.#addAuthHeaders({
			'Content-Type': 'application/json',
			...headers
		});
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
	 * @param {import('node-fetch').HeadersInit} headers - headers to add to request
	 * @returns {import('node-fetch').HeadersInit}
	 */
	#addAuthHeaders(headers) {
		if (this.tokens?.access_token) {
			headers['Authorization'] = 'Bearer ' + this.tokens.access_token;
		} else if (this.tokens?.client_creds) {
			headers['Authorization'] = 'Bearer ' + this.tokens.client_creds;
		}

		if (this.tokens?.id_token) {
			headers['Authentication'] = this.tokens.id_token;
		}

		return headers;
	}

	/**
	 * @param {string} endpoint
	 * @returns {Promise<import('node-fetch').Response>}
	 * @throws {ApiClientError|Error}
	 */
	#makeGetRequest(endpoint) {
		return this.handler(endpoint, 'GET');
	}

	/**
	 * @param {string} endpoint
	 * @returns {Promise<import('node-fetch').Response>}
	 * @throws {ApiClientError|Error}
	 */
	#makeDeleteRequest(endpoint) {
		return this.handler(endpoint, 'DELETE');
	}
}

module.exports = { DocumentsApiClient };
