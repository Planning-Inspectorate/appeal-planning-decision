const OptionsQuestion = require('../../options-question');

class RadioQuestion extends OptionsQuestion {
	constructor({ title, question, description, fieldName, viewFolder, options, validators }) {
		super({
			title,
			question,
			description,
			viewFolder: !viewFolder ? 'radio' : viewFolder,
			fieldName,
			options,
			validators
		});
	}
}

module.exports = RadioQuestion;
