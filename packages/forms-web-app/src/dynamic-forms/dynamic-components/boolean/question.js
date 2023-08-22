const RadioQuestion = require('../radio/question');

class BooleanQuestion extends RadioQuestion {
	constructor({ title, question, description, fieldName } = {}) {
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
		super({ title, question, description, fieldName, options });
	}
}

module.exports = BooleanQuestion;
