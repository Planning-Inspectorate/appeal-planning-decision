const { BaseValidator } = require('./baseValidator');

class BooleanValidator extends BaseValidator {

	constructor() {
		super();
		// Todo - either programtically return the type or use a constants file
		this.type = "boolean";
		this.errorMessage = "Please select an answer";
	}
}

module.exports = { BooleanValidator };