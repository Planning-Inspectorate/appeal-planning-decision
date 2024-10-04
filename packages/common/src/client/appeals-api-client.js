const { default: fetch } = require('node-fetch');
const crypto = require('crypto');
const { handleApiErrors, ApiClientError } = require('./api-client-error');
const { buildQueryString } = require('./utils');
const { JOURNEY_TYPES } = require('@pins/common/src/dynamic-forms/journey-types');

const parentLogger = require('../lib/logger');

const v2 = '/api/v2';
const trailingSlashRegex = /\/$/;

// Internal API types
/**
 * @typedef {import('appeals-service-api').Api.AppealCase} AppealCase
 * @typedef {import('appeals-service-api').Api.AppealCaseDetailed} AppealCaseDetailed
 * @typedef {import('appeals-service-api').Api.AppealSubmission} AppealSubmission
 * @typedef {import('appeals-service-api').Api.LPAQuestionnaireSubmission} LPAQuestionnaireSubmission
 * @typedef {import('appeals-service-api').Api.AppealCaseWithRule6Parties} AppealCaseWithRule6Parties
 * @typedef {import('appeals-service-api').Api.AppealUser} AppealUser
 * @typedef {import('appeals-service-api').Api.AppellantSubmission} AppellantSubmission
 * @typedef {import('appeals-service-api').Api.SubmissionAddress} SubmissionAddress
 * @typedef {import('appeals-service-api').Api.Event} Event
 * @typedef {import('appeals-service-api').Api.ServiceUser} ServiceUserAPI
 * @typedef {import('pins-data-model/src/schemas').AppealHASCase} AppealHASCase
 * @typedef {import('appeals-service-api').Api.InterestedPartyComment} InterestedPartyComment
 * @typedef {import('appeals-service-api').Api.InterestedPartySubmission} InterestedPartySubmission
 * @typedef {import('appeals-service-api').Api.ListedBuilding} ListedBuilding
 * @typedef {import('appeals-service-api').Api.LPAStatementSubmission} LPAStatementSubmission
 * @typedef {import('appeals-service-api').Api.AppellantFinalCommentSubmission} AppellantFinalCommentSubmission
 * @typedef {import('appeals-service-api').Api.LPAFinalCommentSubmission} LPAFinalCommentSubmission
 * @typedef {import('appeals-service-api').Api.AppealStatement} AppealStatement
 */

// Data model types
/**
 * @typedef {import('pins-data-model/src/schemas').ServiceUser} ServiceUser
 * @typedef {import('pins-data-model/src/schemas').AppealDocument} AppealDocument
 * @typedef {import('pins-data-model/src/schemas').AppealEvent} AppealEvent
 */

/**
 * @typedef {{access_token: string|undefined|null, id_token: string|undefined|null, client_creds: string|undefined|null}} AuthTokens
 */

/**
 * @class Api Client for v2 urls in appeals-service-api
 */
class AppealsApiClient {
	/**
	 * @param {string} baseUrl - e.g. https://example.com
	 * @param {AuthTokens} [tokens]
	 * @param {number} [timeout] - timeout in ms defaults to 1000 (ms)
	 */
	constructor(baseUrl, tokens, timeout = 1000) {
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
		this.name = 'Appeals Service API';
	}

	/**
	 * @param {string} email
	 * @param {string} appealSqlId
	 * @param {string} [role]
	 * @returns {Promise<AppealCase>}
	 */
	async linkUserToV2Appeal(email, appealSqlId, role) {
		let roleBody = role ? { role: role } : undefined;
		const endpoint = `${v2}/users/${encodeURIComponent(email?.trim())}/appeal/${appealSqlId}`;
		const response = await this.#makePostRequest(endpoint, roleBody);
		return response.json();
	}

	/**
	 * @param {string} email
	 * @returns {Promise<AppealUser>}
	 */
	async getUserByEmailV2(email) {
		const endpoint = `${v2}/users/${encodeURIComponent(email?.trim())}`;
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
		const endpoint = `${v2}/users/${id}`;
		const response = await this.#makePatchRequest(endpoint, {
			lpaStatus: status
		});
		return response.json();
	}

	/**
	 * 'Public' API, only checks published cases.
	 *
	 * Check if a case reference exists.
	 * todo, make this call more efficient
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
	 * @returns {Promise<AppealCaseDetailed>}
	 */
	async getAppealCaseByCaseRef(caseReference) {
		const endpoint = `${v2}/appeal-cases/${caseReference}`;
		const response = await this.#makeGetRequest(endpoint);
		return response.json();
	}

	/**
	 * Gets events for a case.
	 * @param {string} caseReference
	 * @param {object} [options]
	 * @param {boolean} [options.includePast]
	 * @param {string} [options.type]
	 * @returns {Promise<Array<Event>>}
	 */
	async getEventsByCaseRef(caseReference, options) {
		const urlParams = new URLSearchParams();

		if (options?.includePast) urlParams.append('includePast', 'true');
		if (options?.type) urlParams.append('type', options.type);

		const endpoint = `${v2}/appeal-cases/${caseReference}/events?${urlParams.toString()}`;
		const response = await this.#makeGetRequest(endpoint);
		return response.json();
	}

	/**
	 * @param {AppealHASCase} data
	 * @returns {Promise<AppealCase>}
	 */
	async putAppealCase(data) {
		const endpoint = `${v2}/appeal-cases/${data.caseReference}`;
		const response = await this.#makePutRequest(endpoint, data);
		return response.json();
	}

	/**
	 * @param {ServiceUser} data
	 * @returns {Promise<ServiceUser>}
	 */
	async putServiceUser(data) {
		const endpoint = `${v2}/service-users/`;
		const response = await this.#makePutRequest(endpoint, data);
		return response.json();
	}

	/**
	 * @param {AppealDocument} data
	 * @returns {Promise<AppealDocument>}
	 */
	async putAppealDocument(data) {
		const endpoint = `${v2}/documents/`;
		const response = await this.#makePutRequest(endpoint, data);
		return response.json();
	}

	/**
	 * @param {string} id
	 * @returns {Promise<void>}
	 */
	async deleteAppealDocument(id) {
		const endpoint = `${v2}/documents/${id}`;
		await this.#makeDeleteRequest(endpoint);
		return;
	}

	/**
	 * @param {AppealEvent} data
	 * @returns {Promise<AppealEvent>}
	 */
	async putAppealEvent(data) {
		const endpoint = `${v2}/events/`;
		const response = await this.#makePutRequest(endpoint, data);
		return response.json();
	}

	/**
	 * 'Public' API, only checks published cases.
	 *
	 * @param {Object<string, any>} params
	 * @returns {Promise<import('appeals-service-api').Api.AppealCase[]>}
	 */
	async getPostcodeSearchResults(params = {}) {
		const endpoint = `${v2}/appeal-cases${buildQueryString(params)}`;
		const response = await this.#makeGetRequest(endpoint);
		return response.json();
	}

	/**
	 * @returns {Promise<(AppealCase|AppealSubmission)[]>}
	 */
	async getUserAppeals() {
		const endpoint = `${v2}/appeals/`;
		const response = await this.#makeGetRequest(endpoint);
		return response.json();
	}

	/**
	 * @param {string} lpaCode
	 * @returns {Promise<AppealCase[]>}
	 */
	async getAppealsCaseDataV2(lpaCode) {
		const urlParams = new URLSearchParams();
		urlParams.append('lpa-code', lpaCode);
		const endpoint = `${v2}/appeal-cases?${urlParams.toString()}`;
		const response = await this.#makeGetRequest(endpoint);
		return response.json();
	}

	/**
	 * todo, use a call to appeal-cases and use token rather than user/appeal-cases
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
	 * @returns {Promise<AppealCaseDetailed[]>}
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
	 * @param {{ lpaCode: string, caseStatus: string }} params
	 * @returns {Promise<AppealCase[]>}
	 */
	async getAppealsCasesByLpaAndStatus({ lpaCode, caseStatus }) {
		const urlParams = new URLSearchParams();
		urlParams.append('lpa-code', lpaCode);
		urlParams.append('case-status', caseStatus);
		const endpoint = `${v2}/appeal-cases?${urlParams.toString()}`;
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
	async postLPASubmissionDocumentUpload(caseReference, data) {
		const endpoint = `${v2}/appeal-cases/${caseReference}/lpa-questionnaire-submission/document-upload`;
		const response = await this.#makePostRequest(endpoint, data);
		return response.json();
	}

	/**
	 * @param {string} caseReference
	 * @returns {Promise<(LPAStatementSubmission)>}
	 */
	async getLPAStatement(caseReference) {
		const endpoint = `${v2}/appeal-cases/${caseReference}/lpa-statement-submission`;
		const response = await this.#makeGetRequest(endpoint);
		return response.json();
	}

	/**
	 * @param {string} caseReference
	 * @returns {Promise<(LPAStatementSubmission)>}
	 */
	async postLPAStatement(caseReference) {
		const endpoint = `${v2}/appeal-cases/${caseReference}/lpa-statement-submission`;
		const response = await this.#makePostRequest(endpoint);
		return response.json();
	}
	/**
	 * @param {string} caseReference
	 * @returns {Promise<void>}
	 */
	async submitLPAStatement(caseReference) {
		const endpoint = `${v2}/appeal-cases/${caseReference}/lpa-statement-submission/submit`;
		await this.#makePostRequest(endpoint);
	}

	/**
	 * @param {string} caseReference
	 * @param {object} data
	 * @returns {Promise<(LPAStatementSubmission)>}
	 */
	async patchLPAStatement(caseReference, data) {
		const endpoint = `${v2}/appeal-cases/${caseReference}/lpa-statement-submission`;
		const response = await this.#makePatchRequest(endpoint, data);
		return response.json();
	}

	/**
	 * @param {string} caseReference
	 * @param {object} data
	 * @returns {Promise<(LPAStatementSubmission)>}
	 */
	async postLPAStatementDocumentUpload(caseReference, data) {
		const endpoint = `${v2}/appeal-cases/${caseReference}/lpa-statement-submission/document-upload`;
		const response = await this.#makePostRequest(endpoint, data);
		return response.json();
	}

	/**
	 * @param {string} caseReference
	 * @param {string} documentId
	 * @returns {Promise<(LPAStatementSubmission)>}
	 */
	async deleteLPAStatementDocumentUpload(caseReference, documentId) {
		const endpoint = `${v2}/appeal-cases/${caseReference}/lpa-statement-submission/document-upload/${documentId}`;
		const response = await this.#makeDeleteRequest(endpoint);
		return response.json();
	}

	/**
	 * @param {string} caseReference
	 * @param {string} type
	 * @returns {Promise<AppealStatement>}
	 */
	async getAppealStatement(caseReference, type) {
		const urlParams = new URLSearchParams();
		urlParams.append('type', type);
		const endpoint = `${v2}/appeal-cases/${caseReference}/appeal-statements?${urlParams.toString()}`;
		const response = await this.#makeGetRequest(endpoint);
		return response.json();
	}

	/**
	 * @param {string} caseReference
	 * @returns {Promise<(AppellantFinalCommentSubmission)>}
	 */
	async getAppellantFinalCommentSubmission(caseReference) {
		const endpoint = `${v2}/appeal-cases/${caseReference}/appellant-final-comment-submission`;
		const response = await this.#makeGetRequest(endpoint);
		return response.json();
	}

	/**
	 * @param {string} caseReference
	 * @returns {Promise<(AppellantFinalCommentSubmission)>}
	 */
	async postAppellantFinalCommentSubmission(caseReference) {
		const endpoint = `${v2}/appeal-cases/${caseReference}/appellant-final-comment-submission`;
		const response = await this.#makePostRequest(endpoint);
		return response.json();
	}

	/**
	 * @param {string} caseReference
	 * @param {object} data
	 * @returns {Promise<(AppellantFinalCommentSubmission)>}
	 */
	async patchAppellantFinalCommentSubmission(caseReference, data) {
		const endpoint = `${v2}/appeal-cases/${caseReference}/appellant-final-comment-submission`;
		const response = await this.#makePatchRequest(endpoint, data);
		return response.json();
	}

	/**
	 * @param {string} caseReference
	 * @param {object} data
	 * @returns {Promise<(AppellantFinalCommentSubmission)>}
	 */
	async postAppellantFinalCommentDocumentUpload(caseReference, data) {
		const endpoint = `${v2}/appeal-cases/${caseReference}/appellant-final-comment-submission/document-upload`;
		const response = await this.#makePostRequest(endpoint, data);
		return response.json();
	}

	/**
	 * @param {string} caseReference
	 * @param {string} documentId
	 * @returns {Promise<(AppellantFinalCommentSubmission)>}
	 */
	async deleteAppellantFinalCommentDocumentUpload(caseReference, documentId) {
		const endpoint = `${v2}/appeal-cases/${caseReference}/appellant-final-comment-submission/document-upload/${documentId}`;
		const response = await this.#makeDeleteRequest(endpoint);
		return response.json();
	}

	/**
	 * @param {string} caseReference
	 * @returns {Promise<void>}
	 */
	async submitAppellantFinalCommentSubmission(caseReference) {
		const endpoint = `${v2}/appeal-cases/${caseReference}/appellant-final-comment-submission/submit`;
		await this.#makePostRequest(endpoint);
	}

	/**
	 * @param {string} caseReference
	 * @returns {Promise<(LPAFinalCommentSubmission)>}
	 */
	async getLPAFinalCommentSubmission(caseReference) {
		const endpoint = `${v2}/appeal-cases/${caseReference}/lpa-final-comment-submission`;
		const response = await this.#makeGetRequest(endpoint);
		return response.json();
	}

	/**
	 * @param {string} caseReference
	 * @returns {Promise<(LPAFinalCommentSubmission)>}
	 */
	async postLPAFinalCommentSubmission(caseReference) {
		const endpoint = `${v2}/appeal-cases/${caseReference}/lpa-final-comment-submission`;
		const response = await this.#makePostRequest(endpoint);
		return response.json();
	}

	/**
	 * @param {string} caseReference
	 * @param {object} data
	 * @returns {Promise<(LPAFinalCommentSubmission)>}
	 */
	async patchLPAFinalCommentSubmission(caseReference, data) {
		const endpoint = `${v2}/appeal-cases/${caseReference}/lpa-final-comment-submission`;
		const response = await this.#makePatchRequest(endpoint, data);
		return response.json();
	}

	/**
	 * @param {string} caseReference
	 * @param {object} data
	 * @returns {Promise<(LPAFinalCommentSubmission)>}
	 */
	async postLPAFinalCommentDocumentUpload(caseReference, data) {
		const endpoint = `${v2}/appeal-cases/${caseReference}/lpa-final-comment-submission/document-upload`;
		const response = await this.#makePostRequest(endpoint, data);
		return response.json();
	}

	/**
	 * @param {string} caseReference
	 * @param {string} documentId
	 * @returns {Promise<(LPAFinalCommentSubmission)>}
	 */
	async deleteLPAFinalCommentDocumentUpload(caseReference, documentId) {
		const endpoint = `${v2}/appeal-cases/${caseReference}/lpa-final-comment-submission/document-upload/${documentId}`;
		const response = await this.#makeDeleteRequest(endpoint);
		return response.json();
	}

	/**
	 * @param {string} caseReference
	 * @returns {Promise<void>}
	 */
	async submitLPAFinalCommentSubmission(caseReference) {
		const endpoint = `${v2}/appeal-cases/${caseReference}/lpa-final-comment-submission/submit`;
		await this.#makePostRequest(endpoint);
	}

	/**
	 * @param {string} id
	 * @param {object} data
	 * @returns {Promise<(AppellantSubmission)>}
	 */
	async postAppellantSubmissionDocumentUpload(id, data) {
		const endpoint = `${v2}/appellant-submissions/${id}/document-upload`;
		const response = await this.#makePostRequest(endpoint, data);
		return response.json();
	}

	/**
	 * @param {string} caseReference
	 * @param {string} documentId
	 * @returns {Promise<(LPAQuestionnaireSubmission)>}
	 */
	async deleteLPASubmissionDocumentUpload(caseReference, documentId) {
		const endpoint = `${v2}/appeal-cases/${caseReference}/lpa-questionnaire-submission/document-upload/${documentId}`;
		const response = await this.#makeDeleteRequest(endpoint);
		return response.json();
	}

	/**
	 * @param {string} id
	 * @param {string} documentId
	 * @returns {Promise<(AppellantSubmission)>}
	 */
	async deleteAppellantSubmissionDocumentUpload(id, documentId) {
		const endpoint = `${v2}/appellant-submissions/${id}/document-upload/${documentId}`;
		const response = await this.#makeDeleteRequest(endpoint);
		return response.json();
	}

	/**
	 * @param {string} journeyId
	 * @param {string} referenceId
	 * @param {SubmissionAddress} data
	 * @returns {Promise<(LPAQuestionnaireSubmission)>}
	 */
	async postSubmissionAddress(journeyId, referenceId, data) {
		let endpoint;

		if ([JOURNEY_TYPES.HAS_QUESTIONNAIRE, JOURNEY_TYPES.S78_QUESTIONNAIRE].includes(journeyId)) {
			endpoint = `${v2}/appeal-cases/${referenceId}/lpa-questionnaire-submission/address`;
		} else if ([JOURNEY_TYPES.HAS_APPEAL_FORM, JOURNEY_TYPES.S78_APPEAL_FORM].includes(journeyId)) {
			endpoint = `${v2}/appellant-submissions/${referenceId}/address`;
		}

		if (!endpoint) {
			throw new Error(`unknown journey type: ${journeyId}`);
		}

		const response = await this.#makePostRequest(endpoint, data);
		return response.json();
	}

	/**
	 * @param {string} journeyId
	 * @param {string} referenceId
	 * @param {string} addressId
	 * @returns {Promise<(LPAQuestionnaireSubmission)>}
	 */
	async deleteSubmissionAddress(journeyId, referenceId, addressId) {
		let endpoint;

		if ([JOURNEY_TYPES.HAS_QUESTIONNAIRE, JOURNEY_TYPES.S78_QUESTIONNAIRE].includes(journeyId)) {
			endpoint = `${v2}/appeal-cases/${referenceId}/lpa-questionnaire-submission/address/${addressId}`;
		} else if ([JOURNEY_TYPES.HAS_APPEAL_FORM, JOURNEY_TYPES.S78_APPEAL_FORM].includes(journeyId)) {
			endpoint = `${v2}/appellant-submissions/${referenceId}/address/${addressId}`;
		}

		if (!endpoint) {
			throw new Error(`unknown journey type: ${journeyId}`);
		}

		const response = await this.#makeDeleteRequest(endpoint);
		return response.json();
	}

	/**
	 * @param {string} journeyId
	 * @param {string} referenceId
	 * @param {object} data
	 * @returns {Promise<(LPAQuestionnaireSubmission)>}
	 */
	async postSubmissionLinkedCase(journeyId, referenceId, data) {
		let endpoint;
		if ([JOURNEY_TYPES.HAS_QUESTIONNAIRE, JOURNEY_TYPES.S78_QUESTIONNAIRE].includes(journeyId)) {
			endpoint = `${v2}/appeal-cases/${referenceId}/lpa-questionnaire-submission/linked-case`;
		} else if ([JOURNEY_TYPES.HAS_APPEAL_FORM, JOURNEY_TYPES.S78_APPEAL_FORM].includes(journeyId)) {
			endpoint = `${v2}/appellant-submissions/${referenceId}/linked-case`;
		}

		if (!endpoint) {
			throw new Error(`unknown journey type: ${journeyId}`);
		}

		const response = await this.#makePostRequest(endpoint, data);
		return response.json();
	}

	/**
	 * @param {string} journeyId
	 * @param {string} referenceId
	 * @param {string} linkedCaseId
	 * @returns {Promise<(LPAQuestionnaireSubmission)>}
	 */
	async deleteSubmissionLinkedCase(journeyId, referenceId, linkedCaseId) {
		let endpoint;
		if ([JOURNEY_TYPES.HAS_QUESTIONNAIRE, JOURNEY_TYPES.S78_QUESTIONNAIRE].includes(journeyId)) {
			endpoint = `${v2}/appeal-cases/${referenceId}/lpa-questionnaire-submission/linked-case/${linkedCaseId}`;
		} else if ([JOURNEY_TYPES.HAS_APPEAL_FORM, JOURNEY_TYPES.S78_APPEAL_FORM].includes(journeyId)) {
			endpoint = `${v2}/appellant-submissions/${referenceId}/linked-case/${linkedCaseId}`;
		}

		if (!endpoint) {
			throw new Error(`unknown journey type: ${journeyId}`);
		}

		const response = await this.#makeDeleteRequest(endpoint);
		return response.json();
	}

	/**
	 * @param {string} journeyId
	 * @param {string} referenceId
	 * @param {object} data
	 * @returns {Promise<(LPAQuestionnaireSubmission)>}
	 */
	async postSubmissionListedBuilding(journeyId, referenceId, data) {
		let endpoint;
		if ([JOURNEY_TYPES.HAS_QUESTIONNAIRE, JOURNEY_TYPES.S78_QUESTIONNAIRE].includes(journeyId)) {
			endpoint = `${v2}/appeal-cases/${referenceId}/lpa-questionnaire-submission/listed-building`;
		}

		if (!endpoint) {
			throw new Error(`unknown journey type: ${journeyId}`);
		}

		const response = await this.#makePostRequest(endpoint, data);
		return response.json();
	}

	/**
	 * @param {string} journeyId
	 * @param {string} referenceId
	 * @param {string} listedBuildingId
	 * @returns {Promise<(LPAQuestionnaireSubmission)>}
	 */
	async deleteSubmissionListedBuilding(journeyId, referenceId, listedBuildingId) {
		let endpoint;
		if ([JOURNEY_TYPES.HAS_QUESTIONNAIRE, JOURNEY_TYPES.S78_QUESTIONNAIRE].includes(journeyId)) {
			endpoint = `${v2}/appeal-cases/${referenceId}/lpa-questionnaire-submission/listed-building/${listedBuildingId}`;
		}

		if (!endpoint) {
			throw new Error(`unknown journey type: ${journeyId}`);
		}

		const response = await this.#makeDeleteRequest(endpoint);
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
	 * @param {string} caseReference
	 * @returns {Promise<InterestedPartyComment[]>}
	 */
	async getInterestedPartyComments(caseReference) {
		const endpoint = `${v2}/appeal-cases/${caseReference}/interested-party-comments`;
		const response = await this.#makeGetRequest(endpoint);
		return response.json();
	}

	/**
	 * @param {string} caseReference
	 * @param {import("@prisma/client").Prisma.InterestedPartyCommentCreateInput} commentData
	 * @returns {Promise<InterestedPartyComment>}
	 */
	async createInterestedPartyComment(caseReference, commentData) {
		const endpoint = `${v2}/appeal-cases/${caseReference}/interested-party-comments`;
		const response = await this.#makePostRequest(endpoint, commentData);
		return response.json();
	}

	/**
	 * @param {object} ipSubmissionData
	 * @returns {Promise<InterestedPartySubmission>}
	 */
	async submitInterestedPartySubmission(ipSubmissionData) {
		const endpoint = `${v2}/interested-party-submissions`;
		return (await this.#makePostRequest(endpoint, ipSubmissionData)).json();
	}

	/**
	 * @param {string} id
	 * @returns {Promise<void>}
	 */
	async submitAppellantSubmission(id) {
		const endpoint = `${v2}/appellant-submissions/${id}/submit`;
		await this.#makePostRequest(endpoint);
	}

	/**
	 * @param {string} id
	 * @returns {Promise<AppellantSubmission>}
	 */
	async getAppellantSubmission(id) {
		const endpoint = `${v2}/appellant-submissions/${id}`;
		return (await this.#makeGetRequest(endpoint)).json();
	}

	/**
	 * @param {string} id
	 * @returns {Promise<boolean>}
	 */
	async confirmUserOwnsAppellantSubmission(id) {
		const endpoint = `${v2}/appellant-submissions/${id}/confirm-ownership`;
		const response = await this.#makeGetRequest(endpoint);
		return response.status === 200;
	}

	/**
	 * @param {string} id
	 * @returns {Promise<{caseReference: string}>}
	 */
	async getAppellantSubmissionCaseReference(id) {
		const endpoint = `${v2}/appellant-submissions/${id}/case-reference`;
		return (await this.#makeGetRequest(endpoint)).json();
	}

	/**
	 * @param {string} id
	 * @returns {Promise<AppellantSubmission>}
	 */
	async checkOwnershipAndPdfDownloadDetails(id) {
		const endpoint = `${v2}/appellant-submissions/${id}/download-details`;
		return (await this.#makeGetRequest(endpoint)).json();
	}

	/**
	 * @param {string} id
	 * @param {Object} data
	 * @returns {Promise<AppellantSubmission>}
	 */
	async updateAppellantSubmission(id, data) {
		const endpoint = `${v2}/appellant-submissions/${id}`;
		return (await this.#makePatchRequest(endpoint, data)).json();
	}

	/**
	 * @param {Omit<AppellantSubmission, 'id'>} data
	 * @returns {Promise<AppellantSubmission>}
	 */
	async createAppellantSubmission(data) {
		const endpoint = `${v2}/appellant-submissions`;
		return (await this.#makePutRequest(endpoint, data)).json();
	}

	/**
	 * @returns {Promise<string>}
	 */
	async cleanupOldSubmissions() {
		const endpoint = `${v2}/appellant-submissions/cleanup-old-submissions`;
		const response = await this.#makeDeleteRequest(endpoint);
		return await response.text();
	}

	/**
	 * @param {string} reference
	 * @returns {Promise<ListedBuilding>}
	 */
	async getListedBuilding(reference) {
		const endpoint = `${v2}/listed-buildings/${reference}`;
		const response = await this.#makeGetRequest(endpoint);
		return response.json();
	}

	/**
	 * @param {ListedBuilding|Array<ListedBuilding>} data
	 * @returns {Promise<object>}
	 */
	async putListedBuildings(data) {
		const endpoint = `${v2}/listed-buildings/`;
		const response = await this.#makePutRequest(endpoint, data);
		return response.json();
	}

	/**
	 * Handles error responses and timeouts from calls to appeals api
	 * @param {string} path endpoint to call e.g. /api/v2/users
	 * @param {'GET'|'POST'|'PUT'|'DELETE'|'PATCH'} [method] - request method, defaults to 'GET'
	 * @param {import('node-fetch').RequestInit} [opts] - options to pass to fetch can include request body
	 * @param {import('node-fetch').HeadersInit} [headers] - headers to add to request
	 * @returns {Promise<import('node-fetch').Response>}
	 * @throws {ApiClientError|Error}
	 */
	async handler(path, method = 'GET', opts = {}, headers = {}) {
		//todo: can we reuse this handler

		headers = this.#addAuthHeaders({
			...headers
		});
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
	 * @returns {Promise<import('node-fetch').Response>}
	 * @throws {AppealsApiError|Error}
	 */
	#makeDeleteRequest(endpoint) {
		return this.handler(endpoint, 'DELETE');
	}
}

module.exports = { AppealsApiClient, ApiClientError };
