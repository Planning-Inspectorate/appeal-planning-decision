const RadioQuestion = require('../radio/question');

class BooleanTextQuestion extends RadioQuestion {
	constructor({ title, question, description, fieldName, points, validators }) {
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

		super({
			title,
			question,
			description,
			fieldName,
			viewFolder: 'boolean-text',
			options,
			validators
		});

		this.points = points;
	}
}

module.exports = BooleanTextQuestion;
