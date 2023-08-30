const MultiFileUploadQuestion = require('./question');

describe('./src/dynamic-forms/dynamic-components/boolean/question.js', () => {
	it('should create', () => {
		const TITLE = 'A multifile question';
		const QUESTION = 'Do you like files?';
		const DESCRIPTION = 'File question';
		const FIELDNAME = 'files';
		const VALIDATORS = [1, 2];

		const multiFileQuestion = new MultiFileUploadQuestion({
			title: TITLE,
			question: QUESTION,
			description: DESCRIPTION,
			fieldName: FIELDNAME,
			validators: VALIDATORS
		});

		expect(multiFileQuestion.title).toEqual(TITLE);
		expect(multiFileQuestion.question).toEqual(QUESTION);
		expect(multiFileQuestion.description).toEqual(DESCRIPTION);
		expect(multiFileQuestion.fieldName).toEqual(FIELDNAME);
		expect(multiFileQuestion.validators).toEqual(VALIDATORS);
		expect(multiFileQuestion.viewFolder).toEqual('multi-file-upload');
	});
});
