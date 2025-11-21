const ContinueQuestion = require('./question');

const TITLE = 'title';
const QUESTION = 'Question?';
const FIELDNAME = 'field-name';
const LABEL = 'A label';

describe('./src/dynamic-forms/dynamic-components/continue/question.js', () => {
	const getQuestion = () => {
		return new ContinueQuestion({
			title: TITLE,
			question: QUESTION,
			fieldName: FIELDNAME,
			label: LABEL
		});
	};

	it('should create', () => {
		const question = getQuestion();

		expect(question.title).toEqual(TITLE);
		expect(question.question).toEqual(QUESTION);
		expect(question.fieldName).toEqual(FIELDNAME);
		expect(question.viewFolder).toEqual('continue');
		expect(question.label).toEqual(LABEL);
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

		it('should return a view model with label', () => {
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
			expect(result.question.value).toBe('payloadValue');
		});
	});
});
