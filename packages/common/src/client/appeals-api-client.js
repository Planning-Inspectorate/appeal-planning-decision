const { default: fetch } = require('node-fetch');
const crypto = require('crypto');
const AppealsApiError = require('./appeals-api-error');
const { buildQueryString } = require('./utils');

const parentLogger = require('../lib/logger');

const v2 = '/api/v2';
const trailingSlashRegex = /\/$/;

/**
 * @typedef {import('appeals-service-api').Api.AppealCase} AppealCase
 * @typedef {import('appeals-service-api').Api.AppealCaseWithAppellant} AppealCaseWithAppellant
 * @typedef {import('appeals-service-api').Api.AppealSubmission} AppealSubmission
 */

/**
 * @class Api Client for v2 urls in appeals-service-api
 */
class AppealsApiClient {
	/**
	 * @param {string} baseUrl - e.g. https://example.com
	 * @param {number} [timeout] - timeout in ms defaults to 1000 (ms)
	 */
	constructor(baseUrl, timeout = 1000) {
		if (!baseUrl) {
			throw new Error('baseUrl is required');
		}

		/** @type {string} */
		this.baseUrl = baseUrl.replace(trailingSlashRegex, '');
		/** @type {number} */
		this.timeout = timeout;
	}

	/**
	 * @param {string} email
	 * @param {string} appealSqlId
	 * @param {string} [role]
	 * @returns {Promise<import('appeals-service-api').Api.AppealCaseWithAppellant>}
	 */
	async linkUserToV2Appeal(email, appealSqlId, role) {
		let roleBody = role ? { role: role } : undefined;
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
	 * @param {string} email
	 * @returns {Promise<import('appeals-service-api').Api.AppealUser>}
	 */
	async createUser(email) {
		const endpoint = `${v2}/users`;
		const response = await this.#makePostRequest(endpoint, {
			email: email
		});
		return response.json();
	}

	/**
	 * @param {string} ref
	 * @returns {Promise<boolean>}
	 */
	async appealCaseRefExists(ref) {
		const endpoint = `${v2}/appeal-cases/${ref}`;
		try {
			const response = await this.#makeGetRequest(endpoint);
			return response.status === 200;
		} catch (error) {
			if (error instanceof AppealsApiError) {
				if (error.code === 404) {
					return false;
				}
			}
			throw error;
		}
	}

	/**
	 * @param {AppealCase} data
	 * @returns {Promise<AppealCase>}
	 */
	async putAppealCase(data) {
		const endpoint = `${v2}/appeal-cases/${data.caseReference}`;
		const response = await this.#makePutRequest(endpoint);
		return response.json();
	}

	/**
	 * @param {Object<string, any>} params
	 * @returns {Promise<import('appeals-service-api').Api.AppealCaseWithAppellant[]>}
	 */
	async getPostcodeSearchResults(params = {}) {
		const endpoint = `${v2}/appeal-cases${buildQueryString(params)}`;
		const response = await this.#makeGetRequest(endpoint);
		return response.json();
	}

	/**
	 * @param {string} id
	 * @returns {Promise<(AppealCase|AppealSubmission)[]>}
	 */
	async getUserAppealsById(id) {
		const endpoint = `${v2}/users/${id}/appeals`;
		const response = await this.#makeGetRequest(endpoint);
		return response.json();
	}

	/**
	 * @param {string} lpaCode
	 * @returns {Promise<AppealCaseWithAppellant[]>}
	 */
	async getAppealsCaseDataV2(lpaCode) {
		const urlParams = new URLSearchParams();
		urlParams.append('lpa-code', lpaCode);
		const endpoint = `${v2}/appeal-cases?${urlParams.toString()}`;
		const response = await this.#makeGetRequest(endpoint);
		return response.json();
	}

	/**
	 * @param {{ caseReference: string, userId: string, role: string }} params
	 * @returns {Promise<AppealCase>}
	 */
	async getUsersAppealCase({ caseReference, userId, role }) {
		const urlParams = new URLSearchParams();
		urlParams.append('role', role);
		const endpoint = `${v2}/users/${userId}/appeal-cases/${caseReference}?${urlParams.toString()}`;
		const response = await this.#makeGetRequest(endpoint);
		return response.json();
	}

	/**
	 * @param {string} caseReference
	 * @returns {Promise<AppealCaseWithAppellant[]>}
	 */
	async getAppealCaseDataByCaseReference(caseReference) {
		const endpoint = `${v2}/appeal-cases/${caseReference}`;
		const response = await this.#makeGetRequest(endpoint);
		return response.json();
	}

	/**
	 * @param {string} lpaCode
	 * @returns {Promise<{count: number}>}
	 */
	async getDecidedAppealsCountV2(lpaCode) {
		const urlParams = new URLSearchParams();
		urlParams.append('lpa-code', lpaCode);
		urlParams.append('decided-only', 'true');
		const endpoint = `${v2}/appeal-cases/count?${urlParams.toString()}`;
		const response = await this.#makeGetRequest(endpoint);
		return response.json();
	}

	/**
	 * @param {string} lpaCode
	 * @returns {Promise<AppealCaseWithAppellant[]>}
	 */
	async getDecidedAppealsCaseDataV2(lpaCode) {
		const urlParams = new URLSearchParams();
		urlParams.append('lpa-code', lpaCode);
		urlParams.append('decided-only', 'true');
		const endpoint = `${v2}/appeal-cases?${urlParams.toString()}`;
		const response = await this.#makeGetRequest(endpoint);
		return response.json();
	}
	/**
	 * @param {{ userId: string, appealSubmissionId: string }} params
	 * @returns {Promise<(AppealSubmission)>}
	 */
	async getUserAppealById({ userId, appealSubmissionId }) {
		const endpoint = `${v2}/users/${userId}/appeal-submissions/${appealSubmissionId}`;
		const response = await this.#makeGetRequest(endpoint);
		return response.json();
	}

	/**
	 * Handles error responses and timeouts from calls to appeals api
	 * @param {string} path endpoint to call e.g. /api/v2/users
	 * @param {'GET'|'POST'|'PUT'|'DELETE'} [method] - request method, defaults to 'GET'
	 * @param {object} [opts] - options to pass to fetch can include request body
	 * @param {object} [headers] - headers to add to request
	 * @returns {Promise<import('node-fetch').Response>}
	 * @throws {AppealsApiError|Error}
	 */
	async handler(path, method = 'GET', opts = {}, headers = {}) {
		const correlationId = crypto.randomUUID();
		const url = `${this.baseUrl}${path}`;

		const logger = parentLogger.child({
			correlationId,
			service: 'Appeals Service API'
		});

		logger.debug({ url, method, opts, headers }, 'appeals api call');

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
				logger.error(error, 'appeals api error: timeout');
			} else {
				logger.error(error, 'appeals api error: unhandled fetch error');
			}

			throw error;
		} finally {
			clearTimeout(timeout);
		}

		if (response.ok) {
			return response; // allow caller to handle ok response
		}

		const contentType = response.headers.get('content-type');

		// unlikely scenario probably an api bug
		if (!contentType) {
			logger.error(contentType, 'appeals api error: no content type on response');
			throw new AppealsApiError(response.statusText, response.status);
		}

		// e.g. 500 error
		if (!contentType.startsWith('application/json;')) {
			let error;
			try {
				const responseMessage = await response.text();
				error = new AppealsApiError(responseMessage, response.status);
			} catch (err) {
				logger.error(err, `appeals api error: could not read error response ${contentType}`);
				error = new AppealsApiError(response.statusText, response.status);
			}

			throw error;
		}

		let errorResponse;

		try {
			errorResponse = await response.json();
		} catch (error) {
			// server has indicated json but provided invalid json response
			logger.warn(error, 'appeals api error: failed to parse error response');
			throw new AppealsApiError(response.statusText, response.status);
		}

		if (Array.isArray(errorResponse)) {
			// list of errors on response body
			logger.warn(errorResponse, 'appeals api error: errorResponse.array');
			throw new AppealsApiError(response.statusText, response.status, errorResponse);
		}

		logger.error(errorResponse, 'appeals api error: unknown error format');
		throw new AppealsApiError(response.statusText, response.status);
	}

	/**
	 * @param {string} endpoint
	 * @returns {Promise<import('node-fetch').Response>}
	 * @throws {AppealsApiError|Error}
	 */
	#makeGetRequest(endpoint) {
		return this.handler(endpoint);
	}

	/**
	 * @param {string} endpoint
	 * @param {any} data
	 * @returns {Promise<import('node-fetch').Response>}
	 * @throws {AppealsApiError|Error}
	 */
	#makePostRequest(endpoint, data = {}) {
		return this.handler(endpoint, 'POST', {
			body: JSON.stringify(data)
		});
	}

	/**
	 * @param {string} endpoint
	 * @param {any} data
	 * @returns {Promise<import('node-fetch').Response>}
	 * @throws {AppealsApiError|Error}
	 */
	#makePutRequest(endpoint, data = {}) {
		return this.handler(endpoint, 'PUT', {
			body: JSON.stringify(data)
		});
	}
}

module.exports = { AppealsApiClient, AppealsApiError };
