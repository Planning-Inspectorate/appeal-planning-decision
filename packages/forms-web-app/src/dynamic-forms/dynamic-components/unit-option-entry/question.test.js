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
