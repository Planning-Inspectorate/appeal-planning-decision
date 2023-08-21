const Question = require('../../question');

class MultiFileUploadQuestion extends Question {
	constructor({ title, question, description, fieldName } = {}) {
		super({ title, question, description, type: 'multi-file-upload', fieldName });
	}
}

module.exports = { MultiFileUploadQuestion };
