const { BaseValidator } = require('./baseValidator');

class BooleanValidator extends BaseValidator {
	constructor(errorMessage) {
		super(errorMessage);
	}
}

module.exports = { BooleanValidator };