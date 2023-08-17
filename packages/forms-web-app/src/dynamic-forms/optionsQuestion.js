const Question = require('./question');

class OptionsQuestion extends Question {
	options;

	constructor({ title, question, description, type, fieldName, options } = {}) {
		super({ title, question, description, type, fieldName });
		this.options = options;
	}
}

module.exports = OptionsQuestion;
