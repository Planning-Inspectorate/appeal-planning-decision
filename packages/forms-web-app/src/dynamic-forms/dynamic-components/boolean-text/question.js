const RadioQuestion = require('../radio/question');

class BooleanQuestion extends RadioQuestion {
	constructor({ title, question, description, fieldName, validators } = {}) {
		const options = [
			{
				text: 'Yes',
				value: 'yes'
			},
			{
				text: 'No',
				value: 'no'
			}
		];
		super({ title, question, description, fieldName, options, validators });
		this.type = 'boolean';
	}
}

module.exports = { BooleanQuestion };
