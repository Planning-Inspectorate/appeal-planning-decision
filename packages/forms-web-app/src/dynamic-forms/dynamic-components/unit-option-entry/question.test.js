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

describe('./src/dynamic-forms/dynamic-components/unit-option-entry/question.js', () => {
	it('should create', () => {
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
});
