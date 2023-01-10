const fetch = require('node-fetch');
const uuid = require('uuid');
const { utils } = require('@pins/common');
const jp = require('jsonpath');

const config = require('../config');
const parentLogger = require('./logger');

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
						'X-Correlation-ID': correlationId,
						...headers
					},
					...opts
				});

				logger.debug(apiResponse, 'Appeals API response')

				if (!apiResponse.ok) {
					logger.debug(apiResponse, 'API Response not OK');
					try {
						const errorResponse = await apiResponse.json();
						/* istanbul ignore else */
						if (errorResponse.errors && errorResponse.errors.length) {
							throw new Error(errorResponse.errors.join('\n'));
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

exports.submitAppeal = async (appeal) => {
	const savedAppeal = await handler(`/api/v1/appeals/${appeal.id}`, 'PUT', { body: JSON.stringify(appeal) });
	await handler(`/api/v1/back-office/appeals/${appeal.id}`, 'PUT');
	return savedAppeal;
};

exports.submitAppealDocumentsToBackOffice = async (appeal) => {

	const correlationId = uuid.v4();

	const logger = parentLogger.child({
		correlationId,
		service: 'Appeals Service API'
	});

	const filesToUpload = [
		...jp.query(appeal, '$..uploadedFile').flat(Infinity),
	 	...jp.query(appeal, '$..uploadedFiles').flat(Infinity)
	]
	// Some document JSON is included in the appeal JSON, but these documents may not have been uploaded by the user. 
	// These documents will have a null ID, and if we try to make a call to the API with these, the call will fail. 
	// Therefore, don't process these files in this function!
	.filter(fileJson => fileJson.id);

	logger.debug(filesToUpload, 'Files to upload to appeal on server')
	const responses = []
	for (const file of filesToUpload) {
		const response = await handler(`/api/v1/back-office/appeals/${appeal.id}/documents/${file.id}`, 'PUT');
		responses.push(response);
	}

	logger.debug(responses, 'Result of uploading files to appeal on server')
	return responses;
}

exports.getExistingAppeal = async (sessionId) => {
	return handler(`/api/v1/appeals/${sessionId}`);
};

exports.getLPAList = async () => {
	return handler('/api/v1/local-planning-authorities');
};

exports.getSavedAppeal = async (token) => {
	return handler(`/api/v1/save/${token}`, 'GET');
};

exports.saveAppeal = async (appeal) => {
	return handler(`/api/v1/save`, 'POST', { body: JSON.stringify(appeal) });
};

exports.sendToken = async (appeal) => {
	return handler(`/api/v1/save/`, 'PATCH', { body: JSON.stringify(appeal) });
};

exports.createConfirmEmail = async (appeal) => {
	return handler(`/api/v1/confirm-email`, 'POST', { body: JSON.stringify(appeal) });
};

exports.getConfirmEmail = async (id) => {
	return handler(`/api/v1/confirm-email/${id}`);
};
