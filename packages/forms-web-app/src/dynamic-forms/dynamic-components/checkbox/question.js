const OptionsQuestion = require('../../optionsQuestion');

class CheckboxQuestion extends OptionsQuestion {
	constructor({ title, question, description, fieldName, options } = {}) {
		super({ title, question, description, type: 'checkbox', fieldName, options });
	}
}

module.exports = { CheckboxQuestion };
