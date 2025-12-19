class ApiClientError extends Error {
	/**
	 * @param {string} message
	 * @param {number} code
	 * @param {Array.<string>} [errors]
	 */
	constructor(message, code, errors) {
		super(message);
		this.name = 'ApiClientError';
		/** @type {number} */
		this.code = code;
		/** @type {Array.<string>|undefined} */
		this.errors = errors;
	}
}

/**
 * @param {import('node-fetch').Response|Response} response
 * @param {import('pino').BaseLogger} logger
 * @param {string} apiName
 * @param {{logNotFound: boolean}} [options]
 * @throws {ApiClientError}
 * @returns {Promise<never>}
 */
async function handleApiErrors(
	response,
	logger,
	apiName,
	options = {
		logNotFound: true
	}
) {
	const contentType = response.headers.get('content-type');

	// unlikely scenario probably an api bug
	if (!contentType) {
		logger.error(contentType, apiName + ' error: no content type on response');
		throw new ApiClientError(response.statusText, response.status);
	}

	// e.g. 500 error
	if (!contentType.startsWith('application/json;')) {
		let error;
		try {
			const responseMessage = await response.text();
			error = new ApiClientError(responseMessage, response.status);
		} catch (err) {
			logger.error({ err }, `${apiName} error: could not read error response ${contentType}`);
			error = new ApiClientError(response.statusText, response.status);
		}

		throw error;
	}

	let errorResponse;

	try {
		errorResponse = await response.json();
	} catch (error) {
		// server has indicated json but provided invalid json response
		logger.warn({ error }, apiName + ' error: failed to parse error response');
		throw new ApiClientError(response.statusText, response.status);
	}

	if (Array.isArray(errorResponse)) {
		// list of errors on response body
		logger.warn(errorResponse, apiName + ' error: errorResponse.array');
		throw new ApiClientError(response.statusText, response.status, errorResponse);
	}

	if (response.status === 404) {
		if (options.logNotFound) {
			logger.warn(errorResponse, apiName + ' error: 404 not found');
		}
		throw new ApiClientError(response.statusText, response.status);
	}

	logger.error(errorResponse, apiName + ' error: unknown error format');
	throw new ApiClientError(response.statusText, response.status);
}

module.exports = { ApiClientError, handleApiErrors };
