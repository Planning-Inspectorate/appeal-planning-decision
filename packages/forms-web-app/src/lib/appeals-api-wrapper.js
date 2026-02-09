const fetch = require('node-fetch');
const uuid = require('uuid');
const { utils } = require('@pins/common');

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

/**
 * deletes an appeal v1
 * @param {string} appealId
 * @returns {Promise<void>}
 */
exports.deleteAppeal = (appealId) => {
	if (!appealId) {
		throw new Error('need an appeal id');
	}

	const appealsServiceApiUrl = `/api/v1/appeals/${appealId}`;
	const method = 'DELETE';

	return handler(appealsServiceApiUrl, method);
};

exports.getExistingAppeal = async (appealId) => {
	return handler(`/api/v1/appeals/${appealId}`);
};

exports.getLPAList = async () => {
	return handler('/api/v1/local-planning-authorities');
};

exports.getLPAById = async (lpaCode) => {
	return handler(`/api/v1/local-planning-authorities/${lpaCode}`);
};

exports.getLPA = async (lpaCode) => {
	return handler(`/api/v1/local-planning-authorities/lpaCode/${lpaCode}`);
};

exports.errorMessages = {
	user: {
		only1Admin: 'Only 1 admin is allowed at a time'
	}
};
