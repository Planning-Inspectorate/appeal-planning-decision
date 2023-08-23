const Question = require('../../question');

class MultiFileUploadQuestion extends Question {
	constructor({ title, question, description, fieldName, validators } = {}) {
		super({ title, question, description, type: 'multi-file-upload', fieldName, validators });
	}
}

module.exports = { MultiFileUploadQuestion };
