const TextEntryQuestion = require('./question');

const TITLE = 'title';
const QUESTION = 'Question?';
const FIELDNAME = 'field-name';
const VALIDATORS = [1, 2];
const HTML = '/path/to/html.njk';
const HINT = 'hint';
const LABEL = 'A label';
const textEntryCheckbox = {
	header: 'TEXT_ENTRY_CHECKBOX',
	text: 'This is a text entry checkbox',
	name: 'textEntryCheckboxName',
	errorMessage: 'This is an error message for the text entry checkbox'
};

describe('./src/dynamic-forms/dynamic-components/text-entry/question.js', () => {
	const getQuestion = () => {
		return new TextEntryQuestion({
			title: TITLE,
			question: QUESTION,
			fieldName: FIELDNAME,
			validators: VALIDATORS,
			html: HTML,
			hint: HINT,
			label: LABEL,
			textEntryCheckbox: textEntryCheckbox
		});
	};

	it('should create', () => {
		const question = getQuestion();

		expect(question.title).toEqual(TITLE);
		expect(question.question).toEqual(QUESTION);
		expect(question.fieldName).toEqual(FIELDNAME);
		expect(question.viewFolder).toEqual('text-entry');
		expect(question.validators).toEqual(VALIDATORS);
		expect(question.html).toEqual(HTML);
		expect(question.hint).toEqual(HINT);
		expect(question.label).toEqual(LABEL);
		expect(question.textEntryCheckbox).toEqual(textEntryCheckbox);
	});

	describe('prepQuestionForRendering', () => {
		const DummySection = {};
		const DummyJourney = {
			response: {
				answers: {}
			},
			getNextQuestionUrl: jest.fn(() => 'mock-skip-url'),
			getBackLink: jest.fn(),
			makeBannerHtmlOverride: jest.fn()
		};

		it('should return a view model with label and textEntryCheckbox', () => {
			const question = getQuestion();

			const payload = { [FIELDNAME]: 'payloadValue' };

			const result = question.prepQuestionForRendering({
				section: DummySection,
				journey: DummyJourney,
				customViewData: undefined,
				payload,
				sessionBackLink: undefined
			});

			expect(result.question.label).toBe(LABEL);
			expect(result.question.textEntryCheckbox).toEqual(textEntryCheckbox);
			expect(result.question.value).toBe('payloadValue');
		});
	});
});
