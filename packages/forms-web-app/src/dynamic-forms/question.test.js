const Question = require('./question');

describe('./src/dynamic-forms/question.js', () => {
	it('should create', () => {
		const TITLE = 'Question1';
		const QUESTION_STRING = 'What is your favourite colour?';
		const FIELDNAME = 'favouriteColour';
		const question = new Question(TITLE, QUESTION_STRING, FIELDNAME);
		expect(question).toBeTruthy();
		expect(question.title).toEqual(TITLE);
		expect(question.question).toEqual(QUESTION_STRING);
		expect(question.fieldName).toEqual(FIELDNAME);
	});
	it('should throw if mandatory parameters not supplied to constructor', () => {
		const TITLE = 'Question1';
		const QUESTION_STRING = 'What is your favourite colour?';
		const FIELDNAME = 'favouriteColour';
		expect(() => new Question('', QUESTION_STRING, FIELDNAME)).toThrow(
			'title parameter is mandatory'
		);
		expect(() => new Question(TITLE, '', FIELDNAME)).toThrow('question parameter is mandatory');
		expect(() => new Question(TITLE, QUESTION_STRING, '')).toThrow(
			'fieldName parameter is mandatory'
		);
	});
});
