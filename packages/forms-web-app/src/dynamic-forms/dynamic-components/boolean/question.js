const RadioQuestion = require('../radio/question');

class BooleanQuestion extends RadioQuestion {
	constructor({ title, question, description, fieldName } = {}) {
		const options = [
			{
				text: 'Yes',
				value: true
			},
			{
				text: 'No',
				value: false
			}
		];
		super({ title, question, description, fieldName, options });
	}
}

module.exports = BooleanQuestion;
