const { JOURNEY_TYPES } = require('@pins/common/src/dynamic-forms/journey-types');
const { OptionsQuestion } = require('./options-question');
const ValidOptionValidator = require('./validator/valid-option-validator');
const nunjucks = require('nunjucks');

jest.mock('nunjucks');

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
				journeyId: JOURNEY_TYPES.HAS_QUESTIONNAIRE,
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

		it('should mark all selected options as checked and with correct attributes', () => {
			const expectedData = { options: [{ value: 'yes' }, { value: 'maybe' }, { value: 'no' }] };
			const question = getTestQuestion(expectedData);

			const journey = {
				journeyId: JOURNEY_TYPES.HAS_QUESTIONNAIRE,
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
			expectedData.options[0].attributes = { 'data-cy': 'answer-' + expectedData.options[0].value };
			expectedData.options[1].attributes = { 'data-cy': 'answer-' + expectedData.options[1].value };
			expectedData.options[2].attributes = { 'data-cy': 'answer-' + expectedData.options[2].value };

			expect(result).toEqual(
				expect.objectContaining({
					question: expect.objectContaining({
						question: question.question,
						options: expectedData.options
					})
				})
			);
		});

		it('should handle conditional fields in options', () => {
			nunjucks.render.mockReturnValue('</p>test html</p>');
			const type = 'textarea';
			const options = [
				{
					text: 'Yes',
					value: 'yes',
					conditional: {
						question: 'a question',
						type: type,
						fieldName: 'another-field-name'
					}
				},
				{
					text: 'No',
					value: 'no'
				}
			];

			const question = getTestQuestion({ options: options });

			// use deep copy of options
			const expectedData = JSON.parse(JSON.stringify({ options: options }));
			expectedData.options[0].checked = false;
			expectedData.options[0].conditional = { html: '</p>test html</p>' };
			expectedData.options[1].checked = false;
			expectedData.options[0].attributes = { 'data-cy': 'answer-' + options[0].value };
			expectedData.options[1].attributes = { 'data-cy': 'answer-' + options[1].value };

			const journey = {
				journeyId: JOURNEY_TYPES.HAS_QUESTIONNAIRE,
				response: {
					answers: {}
				},
				getNextQuestionUrl: jest.fn()
			};

			const customViewData = { hello: 'hi' };
			const result = question.prepQuestionForRendering({}, journey, customViewData);

			expect(nunjucks.render).toHaveBeenCalledWith(`./dynamic-components/conditional/${type}.njk`, {
				fieldName: `${FIELDNAME}_${options[0].conditional.fieldName}`,
				question: options[0].conditional.question,
				hello: 'hi',
				payload: undefined,
				type: type,
				value: ''
			});

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

		it('should handle existing entered values correctly for conditional field', () => {
			nunjucks.render.mockReturnValue('</p>test html</p>');
			const type = 'text';
			const value = 'some text';
			const options = [
				{
					text: 'Yes',
					value: 'yes',
					conditional: {
						question: 'another question',
						type: 'text',
						fieldName: 'conditional-field-name'
					}
				},
				{
					text: 'No',
					value: 'no'
				}
			];

			const question = getTestQuestion({ options: options });

			// use deep copy of options
			const expectedData = JSON.parse(JSON.stringify({ options: options }));
			expectedData.options[0].checked = true;
			expectedData.options[0].conditional = { html: '</p>test html</p>' };
			expectedData.options[1].checked = false;
			expectedData.options[0].attributes = { 'data-cy': 'answer-' + options[0].value };
			expectedData.options[1].attributes = { 'data-cy': 'answer-' + options[1].value };

			const journey = {
				journeyId: JOURNEY_TYPES.HAS_QUESTIONNAIRE,
				response: {
					answers: {
						[question.fieldName]: 'yes',
						[`${question.fieldName}_${options[0].conditional.fieldName}`]: value
					}
				},
				getNextQuestionUrl: jest.fn()
			};

			const customViewData = { hello: 'hi' };
			const result = question.prepQuestionForRendering({}, journey, customViewData);

			expect(nunjucks.render).toHaveBeenCalledWith(`./dynamic-components/conditional/${type}.njk`, {
				fieldName: `${FIELDNAME}_${options[0].conditional.fieldName}`,
				question: options[0].conditional.question,
				hello: 'hi',
				payload: undefined,
				type: type,
				value: value
			});
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
	});
});
