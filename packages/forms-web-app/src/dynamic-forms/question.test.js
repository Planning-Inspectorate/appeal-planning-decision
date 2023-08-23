const Question = require('./question');

describe('./src/dynamic-forms/question.js', () => {
	it('should create', () => {
		const TITLE = 'Question1';
		const QUESTION_STRING = 'What is your favourite colour?';
		const DESCRIPTION = 'A question about your favourite colour';
		const TYPE = 'Select';
		const FIELDNAME = 'favouriteColour';
		const VALIDATORS = [1];

		const question = new Question({
			title: TITLE,
			question: QUESTION_STRING,
			description: DESCRIPTION,
			type: TYPE,
			fieldName: FIELDNAME,
			validators: VALIDATORS
		});
		expect(question).toBeTruthy();
		expect(question.title).toEqual(TITLE);
		expect(question.question).toEqual(QUESTION_STRING);
		expect(question.description).toEqual(DESCRIPTION);
		expect(question.type).toEqual(TYPE);
		expect(question.fieldName).toEqual(FIELDNAME);
		expect(question.validators).toEqual(VALIDATORS);
	});
	it('should throw if mandatory parameters not supplied to constructor', () => {
		const TITLE = 'Question1';
		const QUESTION_STRING = 'What is your favourite colour?';
		const FIELDNAME = 'favouriteColour';
		expect(() => new Question({ question: QUESTION_STRING, fieldName: FIELDNAME })).toThrow(
			'title parameter is mandatory'
		);
		expect(() => new Question({ title: TITLE, fieldName: FIELDNAME })).toThrow(
			'question parameter is mandatory'
		);
		expect(() => new Question({ title: TITLE, question: QUESTION_STRING })).toThrow(
			'fieldName parameter is mandatory'
		);
	});
});
