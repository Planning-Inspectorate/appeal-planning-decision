const OptionsQuestion = require('../../optionsQuestion');

class RadioQuestion extends OptionsQuestion {
	constructor({ title, question, description, fieldName, options } = {}) {
		super({ title, question, description, type: 'radio', fieldName, options });
	}
}

module.exports = RadioQuestion;
