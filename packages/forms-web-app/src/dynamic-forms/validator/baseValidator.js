/**
 * @abstract
 * @class BaseValidator
 */
class BaseValidator {
	constructor() {
		if (this.constructor == BaseValidator) {
			throw new Error("Abstract classes can't be instantiated.");
		}
	}
}

module.exports = BaseValidator;
