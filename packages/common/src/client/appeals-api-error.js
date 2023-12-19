/**
 * @class Api Client for v2 urls in appeals-service-api
 */
class AppealsApiError extends Error {
	/**
	 * @param {string} message
	 * @param {string|number} code
	 * @param {Array.<string>} [errors]
	 */
	constructor(message, code, errors) {
		super(message);
		this.name = 'AppealsApiError';
		/** @type {string|number} */
		this.code = code;
		/** @type {Array.<string>|undefined} */
		this.errors = errors;
	}
}

module.exports = AppealsApiError;
