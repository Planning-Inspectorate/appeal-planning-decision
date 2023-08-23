const OptionsQuestion = require('../../options-question');

class CheckboxQuestion extends OptionsQuestion {
	constructor({ title, question, description, fieldName, options, validators } = {}) {
		super({ title, question, description, type: 'checkbox', fieldName, options, validators });
	}
}

module.exports = { CheckboxQuestion };
