const CheckboxQuestion = require('./question');
const ValidOptionValidator = require('../../validator/valid-option-validator');

describe('./src/dynamic-forms/dynamic-components/checkbox/question.js', () => {
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
			text: 'c',
			value: '3',
			conditional: {
				fieldName: CONDITIONAL_FIELDNAME
			}
		}
	];
	const CHECKBOX_PARAMS = {
		title: TITLE,
		question: QUESTION,
		description: DESCRIPTION,
		fieldName: FIELDNAME,
		url: URL,
		pageTitle: PAGE_TITLE,
		validators: VALIDATORS,
		options: OPTIONS
	};
	const CONDITIONAL_ANSWER_TEXT = 'a conditional answer';
	const JOURNEY = {
		response: {
			answers: {}
		}
	};
	JOURNEY.response.answers[`${FIELDNAME}_${CONDITIONAL_FIELDNAME}`] = CONDITIONAL_ANSWER_TEXT;

	it('should create', () => {
		const question = new CheckboxQuestion(CHECKBOX_PARAMS);

		expect(question.title).toEqual(TITLE);
		expect(question.question).toEqual(QUESTION);
		expect(question.description).toEqual(DESCRIPTION);
		expect(question.fieldName).toEqual(FIELDNAME);
		expect(question.viewFolder).toEqual('checkbox');
		expect(question.url).toEqual(URL);
		expect(question.pageTitle).toEqual(PAGE_TITLE);
		expect(question.validators).toEqual([...VALIDATORS, new ValidOptionValidator()]);
		expect(question.options).toEqual(OPTIONS);
	});

	describe('formatAnswerForSummary', () => {
		it('should return option label when formatAnswerForSummary is called with one answer', () => {
			const question = new CheckboxQuestion(CHECKBOX_PARAMS);
			question.getAction = () => {};
			const formattedAnswer = question.formatAnswerForSummary({}, JOURNEY, '1');
			expect(formattedAnswer[0].value).toEqual('a');
		});

		it('should return formatted option labels when formatAnswerForSummary is called with a string representing several non-conditional answers', () => {
			const question = new CheckboxQuestion(CHECKBOX_PARAMS);
			question.getAction = () => {};
			const formattedAnswer = question.formatAnswerForSummary({}, JOURNEY, '1,2');
			expect(formattedAnswer[0].value).toEqual('a<br>b');
		});

		it('should return formatted option labels when formatAnswerForSummary is called with a string representing several answers including a conditional', () => {
			const question = new CheckboxQuestion(CHECKBOX_PARAMS);
			question.getAction = () => {};
			const formattedAnswer = question.formatAnswerForSummary({}, JOURNEY, '1,2,3');
			expect(formattedAnswer[0].value).toEqual(`a<br>b<br>c<br>${CONDITIONAL_ANSWER_TEXT}`);
		});

		it('should return a formatted option label when formatAnswerForSummary is called with a single conditional answer', () => {
			const question = new CheckboxQuestion(CHECKBOX_PARAMS);
			const conditionalAnswer = {
				value: '3',
				conditional: CONDITIONAL_ANSWER_TEXT
			};
			question.getAction = () => {};
			const formattedAnswer = question.formatAnswerForSummary({}, JOURNEY, conditionalAnswer);
			expect(formattedAnswer[0].value).toEqual(`c<br>${CONDITIONAL_ANSWER_TEXT}`);
		});
	});
});
