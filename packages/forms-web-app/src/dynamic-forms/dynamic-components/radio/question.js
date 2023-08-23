const OptionsQuestion = require('../../options-question');

class RadioQuestion extends OptionsQuestion {
	constructor({ title, question, description, fieldName, options, validators } = {}) {
		super({ title, question, description, type: 'radio', fieldName, options, validators });
	}
}

module.exports = RadioQuestion;
