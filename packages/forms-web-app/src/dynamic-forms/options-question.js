const Question = require('./question');

const ValidOptionValidator = require('./validator/valid-option-validator');

class OptionsQuestion extends Question {
	options;

	constructor({ title, question, description, viewFolder, fieldName, options, validators }) {
		// add default valid options validator to all options questions
		let optionsValidators = [new ValidOptionValidator()];
		if (validators && Array.isArray(validators)) {
			optionsValidators = validators.concat(optionsValidators);
		}

		super({
			title,
			question,
			description,
			viewFolder,
			fieldName,
			validators: optionsValidators
		});
		this.options = options;
	}
}

module.exports = OptionsQuestion;
