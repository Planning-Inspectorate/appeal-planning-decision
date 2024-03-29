const { default: fetch } = require('node-fetch');
const crypto = require('crypto');
const { handleApiErrors, ApiClientError } = require('./api-client-error');
const { buildQueryString } = require('./utils');

const parentLogger = require('../lib/logger');

const v2 = '/api/v2';
const trailingSlashRegex = /\/$/;

/**
 * @typedef {import('appeals-service-api').Api.AppealCase} AppealCase
 * @typedef {import('appeals-service-api').Api.AppealCaseWithAppellant} AppealCaseWithAppellant
 * @typedef {import('appeals-service-api').Api.AppealSubmission} AppealSubmission
 * @typedef {import('appeals-service-api').Api.LPAQuestionnaireSubmission} LPAQuestionnaireSubmission
 * @typedef {import('appeals-service-api').Api.AppealCaseWithRule6Parties} AppealCaseWithRule6Parties
 * @typedef {import('appeals-service-api').Api.AppealUser} AppealUser
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
		/** @type {string} */
		this.name = 'Appeals Service API';
	}

	/**
	 * @param {string} email
	 * @param {string} appealSqlId
	 * @param {string} [role]
	 * @returns {Promise<AppealCaseWithAppellant>}
	 */
	async linkUserToV2Appeal(email, appealSqlId, role) {
		let roleBody = role ? { role: role } : undefined;
		const endpoint = `${v2}/users/${email}/appeal/${appealSqlId}`;
		const response = await this.#makePostRequest(endpoint, roleBody);
		return response.json();
	}

	/**
	 * @param {string} email
	 * @returns {Promise<AppealUser>}
	 */
	async getUserByEmailV2(email) {
		const endpoint = `${v2}/users/${encodeURIComponent(email)}`;
		const response = await this.#makeGetRequest(endpoint);
		return response.json();
	}

	/**
	 * @param {string} id
	 * @returns {Promise<AppealUser>}
	 */
	async getUserById(id) {
		const endpoint = `${v2}/users/${id}`;
		const response = await this.#makeGetRequest(endpoint);
		return response.json();
	}

	/**
	 * @param {string} lpaCode
	 * @returns {Promise<AppealUser[]>}
	 */
	async getUsers(lpaCode) {
		const endpoint = `${v2}/users/?lpaCode=${lpaCode}`;
		const response = await this.#makeGetRequest(endpoint);
		return response.json();
	}

	/**
	 * @param {AppealUser} user
	 * @returns {Promise<AppealUser>}
	 */
	async createUser(user) {
		const endpoint = `${v2}/users`;
		const response = await this.#makePostRequest(endpoint, user);
		return response.json();
	}

	/**
	 * @param {string} id
	 * @returns {Promise<void>}
	 */
	async removeLPAUser(id) {
		const endpoint = `${v2}/users/${id}`;
		await this.#makeDeleteRequest(endpoint);
	}

	/**
	 * @param {string} id
	 * @param {string} status
	 * @returns {Promise<AppealUser>} - updated user
	 */
	async setLPAUserStatus(id, status) {
		const endpoint = `${v2}/users/${id}/status`;
		const response = await this.#makePatchRequest(endpoint, {
			status: status
		});
		return response.json();
	}

	/**
	 * 'Public' API, only checks published cases.
	 *
	 * Check if a case reference exists.
	 *
	 * @param {string} ref
	 * @returns {Promise<boolean>}
	 */
	async appealCaseRefExists(ref) {
		const endpoint = `${v2}/appeal-cases/${ref}`;
		try {
			const response = await this.#makeGetRequest(endpoint);
			return response.status === 200;
		} catch (error) {
			if (error instanceof ApiClientError) {
				if (error.code === 404) {
					return false;
				}
			}
			throw error;
		}
	}

	/**
	 * 'Public' API, only returns published cases.
	 *
	 * @param {string} caseReference
	 * @returns {Promise<AppealCaseWithAppellant>}
	 */
	async getAppealCaseByCaseRef(caseReference) {
		const endpoint = `${v2}/appeal-cases/${caseReference}`;
		const response = await this.#makeGetRequest(endpoint);
		return response.json();
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
	 * 'Public' API, only checks published cases.
	 *
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
	 * @returns {Promise<AppealCaseWithRule6Parties>}
	 */
	async getUsersAppealCase({ caseReference, userId, role }) {
		const urlParams = new URLSearchParams();
		urlParams.append('role', role);
		const endpoint = `${v2}/users/${userId}/appeal-cases/${caseReference}?${urlParams.toString()}`;
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
	 * @param {string} caseReference
	 * @returns {Promise<(LPAQuestionnaireSubmission)>}
	 */
	async getLPAQuestionnaire(caseReference) {
		const endpoint = `${v2}/appeal-cases/${caseReference}/lpa-questionnaire-submission`;
		const response = await this.#makeGetRequest(endpoint);
		return response.json();
	}

	/**
	 * @param {string} caseReference
	 * @returns {Promise<(LPAQuestionnaireSubmission)>}
	 */
	async postLPAQuestionnaire(caseReference) {
		const endpoint = `${v2}/appeal-cases/${caseReference}/lpa-questionnaire-submission`;
		const response = await this.#makePostRequest(endpoint);
		return response.json();
	}

	/**
	 * @param {string} caseReference
	 * @param {object} data
	 * @returns {Promise<(LPAQuestionnaireSubmission)>}
	 */
	async patchLPAQuestionnaire(caseReference, data) {
		const endpoint = `${v2}/appeal-cases/${caseReference}/lpa-questionnaire-submission`;
		const response = await this.#makePatchRequest(endpoint, data);
		return response.json();
	}

	/**
	 * @param {string} caseReference
	 * @param {object} data
	 * @returns {Promise<(LPAQuestionnaireSubmission)>}
	 */
	async postSubmissionDocumentUpload(caseReference, data) {
		const endpoint = `${v2}/appeal-cases/${caseReference}/lpa-questionnaire-submission/document-upload`;
		const response = await this.#makePostRequest(endpoint, data);
		return response.json();
	}

	/**
	 * @param {string} caseReference
	 * @param {object} data
	 * @returns {Promise<(LPAQuestionnaireSubmission)>}
	 */
	async postSubmissionAddress(caseReference, data) {
		const endpoint = `${v2}/appeal-cases/${caseReference}/lpa-questionnaire-submission/address`;
		const response = await this.#makePostRequest(endpoint, data);
		return response.json();
	}

	/**
	 * @param {string} caseReference
	 * @returns {Promise<void>}
	 */
	async submitLPAQuestionnaire(caseReference) {
		const endpoint = `${v2}/appeal-cases/${caseReference}/lpa-questionnaire-submission/submit`;
		await this.#makePostRequest(endpoint);
	}

	/**
	 * Handles error responses and timeouts from calls to appeals api
	 * @param {string} path endpoint to call e.g. /api/v2/users
	 * @param {'GET'|'POST'|'PUT'|'DELETE'|'PATCH'} [method] - request method, defaults to 'GET'
	 * @param {object} [opts] - options to pass to fetch can include request body
	 * @param {object} [headers] - headers to add to request
	 * @returns {Promise<import('node-fetch').Response>}
	 * @throws {ApiClientError|Error}
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
	 * @returns {Promise<import('node-fetch').Response>}
	 * @throws {ApiClientError|Error}
	 */
	#makeGetRequest(endpoint) {
		return this.handler(endpoint);
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

	/**
	 * @param {string} endpoint
	 * @param {any} data
	 * @returns {Promise<import('node-fetch').Response>}
	 * @throws {ApiClientError|Error}
	 */
	#makePutRequest(endpoint, data = {}) {
		return this.handler(endpoint, 'PUT', {
			body: JSON.stringify(data)
		});
	}

	/**
	 * @param {string} endpoint
	 * @param {any} data
	 * @returns {Promise<import('node-fetch').Response>}
	 * @throws {AppealsApiError|Error}
	 */
	#makePatchRequest(endpoint, data) {
		return this.handler(endpoint, 'PATCH', {
			body: JSON.stringify(data)
		});
	}

	/**
	 * @param {string} endpoint
	 * @param {any} data
	 * @returns {Promise<import('node-fetch').Response>}
	 * @throws {AppealsApiError|Error}
	 */
	#makeDeleteRequest(endpoint) {
		return this.handler(endpoint, 'DELETE');
	}
}

module.exports = { AppealsApiClient, ApiClientError };
