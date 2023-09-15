const OptionsQuestion = require('./options-question');
const ValidOptionValidator = require('./validator/valid-option-validator');

describe('./src/dynamic-forms/question.js', () => {
	const TITLE = 'Question1';
	const QUESTION_STRING = 'What is your favourite colour?';
	const FIELDNAME = 'favouriteColour';

	const getTestQuestion = ({ options = [] } = {}) => {
		return new OptionsQuestion({
			title: TITLE,
			question: QUESTION_STRING,
			fieldName: FIELDNAME,
			viewFolder: 'abc',
			options: options
		});
	};

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
			viewFolder: TYPE,
			fieldName: FIELDNAME,
			validators: VALIDATORS,
			options: OPTIONS
		});

		expect(question.title).toEqual(TITLE);
		expect(question.question).toEqual(QUESTION_STRING);
		expect(question.description).toEqual(DESCRIPTION);
		expect(question.viewFolder).toEqual(TYPE);
		expect(question.fieldName).toEqual(FIELDNAME);
		expect(question.options).toEqual(OPTIONS);
		expect(question.validators).toEqual([...VALIDATORS, ...[new ValidOptionValidator()]]);
	});

	describe('prepQuestionForRendering', () => {
		it('should set options on question and call super', () => {
			const expectedData = { options: [{ a: 1 }] };
			const question = getTestQuestion(expectedData);

			const journey = {
				response: {
					answers: {}
				},
				getNextQuestionUrl: jest.fn()
			};

			const customViewData = { hello: 'hi' };
			const result = question.prepQuestionForRendering({}, journey, customViewData);

			expect(result).toEqual(
				expect.objectContaining({
					question: expect.objectContaining({
						question: question.question,
						options: expectedData.options
					}),
					hello: 'hi'
				})
			);
		});

		it('should mark all selected options as checked', () => {
			const expectedData = { options: [{ value: 'yes' }, { value: 'maybe' }, { value: 'no' }] };
			const question = getTestQuestion(expectedData);

			const journey = {
				response: {
					answers: {
						[question.fieldName]: ['yes', 'maybe']
					}
				},
				getNextQuestionUrl: jest.fn()
			};

			const result = question.prepQuestionForRendering({}, journey, {});

			expectedData.options[0].checked = true;
			expectedData.options[1].checked = true;
			expectedData.options[2].checked = false;
			expect(result).toEqual(
				expect.objectContaining({
					question: expect.objectContaining({
						question: question.question,
						options: expectedData.options
					})
				})
			);
		});
	});
});
