jest.mock('nunjucks');
const nunjucks = require('nunjucks');

const UnitOptionEntryQuestion = require('./question');

const TITLE = 'Unit Option Entry question';
const QUESTION = 'A Unit Option Entry question';
const DESCRIPTION = 'A description of a Unit Option Entry question';
const FIELDNAME = 'unit-option-entry-unit';
const CONDITIONAL_FIELDNAME = 'unit-option-entry-quantity';
const HTML = 'some/html/path';
const LABEL = 'a label';
const OPTIONS = [
	{
		text: 'Metres',
		value: 'metres',
		conditional: {
			fieldName: 'unit-option-entry-quantity_metres',
			suffix: 'm'
		}
	},
	{
		text: 'Kilometres',
		value: 'kilometres',
		conditional: {
			fieldName: 'unit-option-entry-quantity_kilometres',
			suffix: 'km',
			conversionFactor: 1000
		}
	}
];

const unitOptionEntryQuestion = new UnitOptionEntryQuestion({
	title: TITLE,
	question: QUESTION,
	description: DESCRIPTION,
	fieldName: FIELDNAME,
	conditionalFieldName: CONDITIONAL_FIELDNAME,
	html: HTML,
	label: LABEL,
	options: OPTIONS
});

describe('./src/dynamic-forms/dynamic-components/unit-option-entry/question.js', () => {
	it('should create', () => {
		expect(unitOptionEntryQuestion.title).toEqual(TITLE);
		expect(unitOptionEntryQuestion.question).toEqual(QUESTION);
		expect(unitOptionEntryQuestion.description).toEqual(DESCRIPTION);
		expect(unitOptionEntryQuestion.fieldName).toEqual(FIELDNAME);
		expect(unitOptionEntryQuestion.conditionalFieldName).toEqual(CONDITIONAL_FIELDNAME);
		expect(unitOptionEntryQuestion.viewFolder).toEqual('unit-option-entry');
		expect(unitOptionEntryQuestion.html).toEqual(HTML);
		expect(unitOptionEntryQuestion.label).toEqual(LABEL);
		expect(unitOptionEntryQuestion.options).toEqual(OPTIONS);
	});

	describe('prepQuestionForRendering', () => {
		const FIELDNAME = 'unit-option-entry-unit';
		const CONDITIONAL_FIELDNAME = 'unit-option-entry-quantity';

		let question;
		let journey;
		let section;
		let nunjucksRenderSpy;

		beforeEach(() => {
			question = unitOptionEntryQuestion;
			section = { name: 'section' };
			journey = {
				response: {
					answers: {
						[FIELDNAME]: 'metres',
						[CONDITIONAL_FIELDNAME]: 123
					}
				},
				getNextQuestionUrl: jest.fn(() => 'mock-skip-url'),
				getBackLink: jest.fn()
			};
			nunjucksRenderSpy = jest.spyOn(nunjucks, 'render').mockImplementation(() => '<html>');
		});

		it('renders options with checked and attributes', () => {
			const result = question.prepQuestionForRendering({ section, journey });
			expect(result.question.options.length).toBe(2);
			expect(result.question.options[0].checked).toBe(true);
			expect(result.question.options[1].checked).toBe(false);
			expect(result.question.options[0].attributes).toEqual({ 'data-cy': 'answer-metres' });
			expect(result.question.options[1].attributes).toEqual({ 'data-cy': 'answer-kilometres' });
		});

		it('renders conditional html with correct value from journey', () => {
			const result = question.prepQuestionForRendering({ section, journey });
			expect(nunjucksRenderSpy).toHaveBeenCalled();
			expect(result.question.options[0].conditional.html).toBe('<html>');
			// Value should be 123 (unconvertedAnswer) / 1 (conversionFactor)
			const callArgs = nunjucksRenderSpy.mock.calls[0][1];
			expect(callArgs.value).toBe(123);
		});

		it('uses payload value if provided', () => {
			const payload = {
				[FIELDNAME]: 'kilometres',
				'unit-option-entry-quantity_kilometres': 7
			};
			const result = question.prepQuestionForRendering({ section, journey, payload });
			expect(result.question.options[1].checked).toBe(true);
			expect(result.question.options[1].conditional.html).toBe('<html>');
			const callArgs = nunjucksRenderSpy.mock.calls[1][1];
			expect(callArgs.value).toBe(7);
		});

		it('passes customViewData to nunjucks.render', () => {
			const customViewData = { foo: 'bar' };
			question.prepQuestionForRendering({ section, journey, customViewData });
			const callArgs = nunjucksRenderSpy.mock.calls[0][1];
			expect(callArgs.foo).toBe('bar');
		});
	});

	describe('getDataToSave', () => {
		const FIELDNAME = 'unit-option-entry-unit';
		const CONDITIONAL_FIELDNAME = 'unit-option-entry-quantity';

		let question;
		let journeyResponse;

		beforeEach(() => {
			question = unitOptionEntryQuestion;
			journeyResponse = { answers: {} };
		});

		it('should save selected option and conditional value (no conversion)', async () => {
			const req = {
				body: {
					[FIELDNAME]: 'metres',
					'unit-option-entry-quantity_metres': 5
				}
			};
			const result = await question.getDataToSave(req, journeyResponse);
			expect(result.answers[FIELDNAME]).toBe('metres');
			expect(result.answers[CONDITIONAL_FIELDNAME]).toBe(5);
			expect(journeyResponse.answers[FIELDNAME]).toEqual(['metres']);
			expect(journeyResponse.answers[CONDITIONAL_FIELDNAME]).toBe(5);
		});

		it('should save selected option and conditional value (with conversion)', async () => {
			const req = {
				body: {
					[FIELDNAME]: 'kilometres',
					'unit-option-entry-quantity_kilometres': 2
				}
			};
			const result = await question.getDataToSave(req, journeyResponse);
			expect(result.answers[FIELDNAME]).toBe('kilometres');
			expect(result.answers[CONDITIONAL_FIELDNAME]).toBe(2000); // 2 * 1000
			expect(journeyResponse.answers[FIELDNAME]).toEqual(['kilometres']);
			expect(journeyResponse.answers[CONDITIONAL_FIELDNAME]).toBe(2000);
		});

		it('should handle multiple selected options', async () => {
			const req = {
				body: {
					[FIELDNAME]: ['metres', 'kilometres'],
					'unit-option-entry-quantity_metres': 1,
					'unit-option-entry-quantity_kilometres': 3
				}
			};
			const result = await question.getDataToSave(req, journeyResponse);
			expect(result.answers[FIELDNAME]).toBe('metres,kilometres');
			// Only the last selected conditional value is saved (per implementation)
			expect(result.answers[CONDITIONAL_FIELDNAME]).toBe(3000);
			expect(journeyResponse.answers[FIELDNAME]).toEqual(['metres', 'kilometres']);
			expect(journeyResponse.answers[CONDITIONAL_FIELDNAME]).toBe(3000);
		});

		it('should throw if no valid options are selected', async () => {
			const req = {
				body: {
					[FIELDNAME]: 'invalid'
				}
			};
			await expect(question.getDataToSave(req, journeyResponse)).rejects.toThrow(
				'User submitted option(s) did not correlate with valid answers to unit-option-entry-unit question'
			);
		});
	});

	describe('formatAnswerForSummary', () => {
		it('should handle decimal string formatting conversion', () => {
			const journey = {
				response: {
					answers: {
						[CONDITIONAL_FIELDNAME]: '1.123456789'
					}
				},
				getCurrentQuestionUrl: jest.fn(),
				getSection: jest.fn()
			};

			const result = unitOptionEntryQuestion.formatAnswerForSummary('test', journey, 'ha');
			expect(result[0].value).toEqual('1.123456789 ha');
		});

		it('should handle int string formatting conversion', () => {
			const journey = {
				response: {
					answers: {
						[CONDITIONAL_FIELDNAME]: '1'
					}
				},
				getCurrentQuestionUrl: jest.fn(),
				getSection: jest.fn()
			};
			const result = unitOptionEntryQuestion.formatAnswerForSummary('test', journey, 'ha');
			expect(result[0].value).toEqual('1 ha');
		});

		it('should error for NaN formatting conversion', () => {
			const journey = {
				response: {
					answers: {
						[CONDITIONAL_FIELDNAME]: 'hello'
					}
				},
				getCurrentQuestionUrl: jest.fn(),
				getSection: jest.fn()
			};

			expect(() => {
				unitOptionEntryQuestion.formatAnswerForSummary('test', journey, 'ha');
			}).toThrow(new Error('Conditional answer had an unexpected type'));
		});
	});
});
