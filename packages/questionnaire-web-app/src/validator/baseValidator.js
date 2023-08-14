class BaseValidator {
	/**
	 *
	 * @param {string} errorMessage The default error message.
	 */
	constructor(errorMessage) {
		this.errorMessage = errorMessage;
	}

}

module.exports = { BaseValidator };