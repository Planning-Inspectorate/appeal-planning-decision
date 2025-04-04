const { JOURNEY_TYPES } = require('@pins/common/src/dynamic-forms/journey-types');
const { OptionsQuestion } = require('./options-question');
const ValidOptionValidator = require('./validator/valid-option-validator');
const nunjucks = require('nunjucks');

jest.mock('nunjucks');

describe('./src/dynamic-forms/question.js', () => {
	const TITLE = 'Question1';
	const QUESTION_STRING = 'What is your favourite colour?';
	const FIELDNAME = 'favouriteColour';

	const journey = {
		journeyId: JOURNEY_TYPES.HAS_QUESTIONNAIRE,
		response: {
			answers: {}
		},
		getNextQuestionUrl: jest.fn(),
		getCurrentQuestionUrl: jest.fn(),
		getSection: jest.fn(),
		getBackLink: jest.fn()
	};

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
			const expectedData = { options: [{ a: 1, divider: 'or', b: 2 }] };
			const question = getTestQuestion(expectedData);

			journey.response.answers = {};

			const customViewData = { hello: 'hi' };
			const result = question.prepQuestionForRendering({ section: {}, journey, customViewData });

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

			journey.response.answers = {
				[question.fieldName]: ['yes', 'maybe']
			};

			const result = question.prepQuestionForRendering({
				section: {},
				journey,
				customViewData: {}
			});

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

			journey.response.answers = {};

			const customViewData = { hello: 'hi' };
			const result = question.prepQuestionForRendering({ section: {}, journey, customViewData });

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

			journey.response.answers = {
				[question.fieldName]: 'yes',
				[`${question.fieldName}_${options[0].conditional.fieldName}`]: value
			};

			const customViewData = { hello: 'hi' };
			const result = question.prepQuestionForRendering({ section: {}, journey, customViewData });

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

	describe('formatAnswerForSummary', () => {
		const TITLE = 'title';
		const QUESTION = 'Question?';
		const DESCRIPTION = 'Describe';
		const FIELDNAME = 'field-name';
		const CONDITIONAL_FIELDNAME = 'conditional-field-name';
		const URL = 'url';
		const PAGE_TITLE = 'this appears in <title>';
		const VALIDATORS = [1, 2];
		const OPTIONS = [
			{ text: 'a', value: '1' },
			{ text: 'b', value: '2' },
			{
				divider: 'or'
			},
			{
				text: 'c',
				value: '3',
				conditional: {
					fieldName: CONDITIONAL_FIELDNAME
				}
			}
		];
		const OPTIONS_PARAMS = {
			title: TITLE,
			question: QUESTION,
			description: DESCRIPTION,
			fieldName: FIELDNAME,
			url: URL,
			pageTitle: PAGE_TITLE,
			validators: VALIDATORS,
			options: OPTIONS,
			viewFolder: 'abc'
		};
		const CONDITIONAL_ANSWER_TEXT = 'a conditional answer';

		beforeEach(() => {
			journey.response.answers[`${FIELDNAME}_${CONDITIONAL_FIELDNAME}`] = CONDITIONAL_ANSWER_TEXT;
		});

		it('should return option label when formatAnswerForSummary is called with one answer', () => {
			const question = new OptionsQuestion(OPTIONS_PARAMS);
			const formattedAnswer = question.formatAnswerForSummary({}, journey, '1');
			expect(formattedAnswer[0].value).toEqual('A');
		});

		it('should return formatted option labels when formatAnswerForSummary is called with a string representing several non-conditional answers', () => {
			const question = new OptionsQuestion(OPTIONS_PARAMS);
			const formattedAnswer = question.formatAnswerForSummary({}, journey, '1,2');
			expect(formattedAnswer[0].value).toEqual('A<br>b');
		});

		it('should return formatted option labels when formatAnswerForSummary is called with a string representing several answers including a conditional', () => {
			const question = new OptionsQuestion(OPTIONS_PARAMS);
			const formattedAnswer = question.formatAnswerForSummary({}, journey, '1,2,3');
			expect(formattedAnswer[0].value).toEqual(`A<br>b<br>c<br>${CONDITIONAL_ANSWER_TEXT}`);
		});

		it('should return a formatted option label when formatAnswerForSummary is called with a single conditional answer', () => {
			const question = new OptionsQuestion(OPTIONS_PARAMS);
			const conditionalAnswer = {
				value: '3',
				conditional: CONDITIONAL_ANSWER_TEXT
			};
			const formattedAnswer = question.formatAnswerForSummary({}, journey, conditionalAnswer);
			expect(formattedAnswer[0].value).toEqual(`c<br>${CONDITIONAL_ANSWER_TEXT}`);
		});
	});
});
