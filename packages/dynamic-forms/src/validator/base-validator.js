/**
 * @abstract
 * @class BaseValidator
 */
class BaseValidator {
	/**
	 * @type {string} error message to display to user
	 */
	// @ts-ignore
	errorMessage;

	constructor() {
		if (this.constructor == BaseValidator) {
			throw new Error("Abstract classes can't be instantiated.");
		}
	}

	/**
	 * @param {import('../questions/question')} _question
	 * @param {import('../journey-response').JourneyResponse} _journeyResponse
	 * @returns {import('express-validator').ValidationChain | import('express-validator').ValidationChain[]}
	 */
	validate(_question, _journeyResponse) {
		throw new Error(
			'BaseValidator validation called directly. BaseValidator is an abstract class. This method should be overridden'
		);
	}
}

module.exports = BaseValidator;
