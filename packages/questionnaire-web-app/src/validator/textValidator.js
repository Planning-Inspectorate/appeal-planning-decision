const { BaseValidator } = require('./baseValidator');

class TextValidator extends BaseValidator {
	constructor(maxLength, minLength, errorMessage, notEmpty = false, textField = null) {
		super(errorMessage);
        this.maxLength = maxLength;
        this.minLength = minLength;
        this.notEmpty = notEmpty;
        this.textField = textField;
	}
}

module.exports = { TextValidator };