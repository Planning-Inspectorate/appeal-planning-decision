const OptionsQuestion = require('./options-question');
const ValidOptionValidator = require('./validator/valid-option-validator');

describe('./src/dynamic-forms/question.js', () => {
	it('should create', () => {
		const TITLE = 'Question1';
		const QUESTION_STRING = 'What is your favourite colour?';
		const DESCRIPTION = 'A question about your favourite colour';
		const TYPE = 'Select';
		const FIELDNAME = 'favouriteColour';
		const VALIDATORS = [1];
		const OPTIONS = { a: 1 };

		const question = new OptionsQuestion({
			title: TITLE,
			question: QUESTION_STRING,
			description: DESCRIPTION,
			type: TYPE,
			fieldName: FIELDNAME,
			validators: VALIDATORS,
			options: OPTIONS
		});

		expect(question.title).toEqual(TITLE);
		expect(question.question).toEqual(QUESTION_STRING);
		expect(question.description).toEqual(DESCRIPTION);
		expect(question.type).toEqual(TYPE);
		expect(question.fieldName).toEqual(FIELDNAME);
		expect(question.options).toEqual(OPTIONS);
		expect(question.validators).toEqual([...VALIDATORS, ...[new ValidOptionValidator()]]);
	});
});
