const fetch = require('node-fetch');
const uuid = require('uuid');
const { utils } = require('@pins/common');

const config = require('../config');
const parentLogger = require('./logger');
const baseUrl = '/api/v1';

async function handler(path, method = 'GET', opts = {}, headers = {}) {
	const correlationId = uuid.v4();
	const url = `${config.appeals.url}${path}`;

	const logger = parentLogger.child({
		correlationId,
		service: 'Appeals Service API'
	});

	try {
		logger.debug({ url, method, opts, headers }, 'New call');

		return await utils.promiseTimeout(
			config.appeals.timeout,
			Promise.resolve().then(async () => {
				const apiResponse = await fetch(url, {
					method,
					headers: {
						'Content-Type': 'application/json',
						...headers
					},
					...opts
				});

				logger.debug(apiResponse, 'Appeals API response');

				if (!apiResponse.ok) {
					logger.debug(apiResponse, 'API Response not OK');
					try {
						const errorResponse = await apiResponse.json();
						/* istanbul ignore else */
						if (errorResponse.errors && errorResponse.errors.length) {
							throw new Error(errorResponse.errors.join('\n'));
						}

						/* istanbul ignore else */
						if (Array.isArray(errorResponse)) {
							throw new Error(errorResponse.join('\n'));
						}

						/* istanbul ignore next */
						throw new Error(apiResponse.statusText);
					} catch (e) {
						throw new Error(e.message);
					}
				}

				const data = await apiResponse.json();
				return data;
			})
		);
	} catch (err) {
		logger.error({ err }, 'Error');
		throw err;
	}
}

/**
 * A single wrapper around creating, or updating a new or existing appeal through the Appeals
 * Service API.
 *
 * @param appeal
 * @returns {Promise<*>}
 */
exports.createOrUpdateAppeal = (appeal) => {
	let appealsServiceApiUrl = '/api/v1/appeals';
	let method = 'POST';

	if (appeal && appeal.id && appeal.id !== '') {
		appealsServiceApiUrl += `/${appeal.id}`;
		method = 'PUT';
	}
	return handler(appealsServiceApiUrl, method, {
		body: JSON.stringify(appeal)
	});
};

exports.submitAppealForBackOfficeProcessing = async (appeal) => {
	const savedAppeal = await handler(`/api/v1/appeals/${appeal.id}`, 'PUT', {
		body: JSON.stringify(appeal)
	});
	await handler(`/api/v1/back-office/appeals/${appeal.id}`, 'POST');
	return savedAppeal;
};

exports.getExistingAppeal = async (appealId) => {
	return handler(`/api/v1/appeals/${appealId}`);
};

exports.getExistingAppealByLPACodeAndId = async (lpaCode, appealId) => {
	return handler(`/api/v1/appeals/${lpaCode}/${appealId}`);
};

exports.getLPAList = async () => {
	return handler('/api/v1/local-planning-authorities');
};

exports.getLPA = async (lpaCode) => {
	return handler(`/api/v1/local-planning-authorities/lpaCode/${lpaCode}`);
};

exports.getSavedAppeal = async (id) => {
	return handler(`/api/v1/save/${id}`, 'GET');
};

exports.saveAppeal = async (appeal) => {
	return handler(`/api/v1/save`, 'POST', { body: JSON.stringify(appeal) });
};

exports.sendToken = async (id, action, emailAddress) => {
	return handler(`/api/v1/token/`, 'PUT', {
		body: JSON.stringify({
			id: id,
			action: action,
			emailAddress: emailAddress
		})
	});
};

exports.checkToken = async (id, token) => {
	return handler(`/api/v1/token/`, 'POST', {
		body: JSON.stringify({
			id,
			token
		})
	});
};

exports.getFinalCommentData = async (caseReference) => {
	return handler(`/api/v1/final-comments/appeal/${caseReference}`, 'GET');
};

exports.submitFinalComment = async (finalComment) => {
	return handler(`/api/v1/final-comments/`, 'POST', {
		body: JSON.stringify(finalComment)
	});
};

exports.createUser = async (email, isAdmin, lpaCode) => {
	return handler(`/api/v1/users/`, 'POST', {
		body: JSON.stringify({
			email,
			isAdmin,
			lpaCode
		})
	});
};

exports.getUserById = async (id) => {
	return handler(`/api/v1/users/${id}`, 'GET');
};

exports.getUserByEmail = async (email) => {
	return handler(`/api/v1/users/${email}`, 'GET');
};

exports.setUserStatus = async (id, status) => {
	return handler(`${baseUrl}/users/${id}/status`, 'PUT', {
		body: JSON.stringify({
			status: status
		})
	});
};

exports.getUsers = async (lpaCode) => {
	return handler(`/api/v1/users/?lpaCode=${lpaCode}`, 'GET');
};

exports.removeUser = async (id) => {
	return handler(`/api/v1/users/${id}`, 'DELETE');
};

exports.getAppealsCaseData = async (lpaCode) => {
	return handler(`/api/v1/appeals-case-data/${lpaCode}`, 'GET');
};

exports.getAppealByLPACodeAndId = async (lpaCode, id) => {
	return handler(`/api/v1/appeals-case-data/${lpaCode}/${id}`, 'GET');
};

exports.getAppealDocumentMetaData = async (caseRef, documentType, returnMultipleDocuments = '') => {
	return handler(
		`/api/v1/document-meta-data/${caseRef}?documenttype=${documentType}&returnMultipleDocuments=${returnMultipleDocuments}`,
		'GET'
	);
};

exports.errorMessages = {
	user: {
		only1Admin: 'Only 1 admin is allowed at a time'
	}
};
