const Question = require('./question');

const ValidOptionValidator = require('./validator/valid-option-validator');

class OptionsQuestion extends Question {
	options;

	constructor({ title, question, description, type, fieldName, options, validators } = {}) {
		// add default valid options validator to all options questions
		let optionsValidators = [new ValidOptionValidator()];
		if (validators && Array.isArray(validators)) {
			optionsValidators = validators.concat(optionsValidators);
		}

		super({
			title,
			question,
			description,
			type,
			fieldName,
			validators: optionsValidators
		});
		this.options = options;
	}
}

module.exports = OptionsQuestion;
