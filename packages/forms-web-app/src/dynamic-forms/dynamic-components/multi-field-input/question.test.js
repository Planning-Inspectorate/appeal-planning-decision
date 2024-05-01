const MultiFieldInputQuestion = require('./question');

const TITLE = 'title';
const QUESTION = 'Question?';
const FIELDNAME = 'field-name';
const VALIDATORS = [1, 2];
const HTML = '/path/to/html.njk';
const HINT = 'hint';
const LABEL = 'A label';
const INPUTFIELDS = [{ fieldName: 'a' }, { fieldName: 'b' }];

function createMultiFieldInputQuestion(
	title = TITLE,
	question = QUESTION,
	fieldName = FIELDNAME,
	validators = VALIDATORS,
	html = HTML,
	hint = HINT,
	label = LABEL,
	inputFields = INPUTFIELDS
) {
	return new MultiFieldInputQuestion({
		title: title,
		question: question,
		fieldName: fieldName,
		validators: validators,
		html: html,
		hint: hint,
		label: label,
		inputFields: inputFields
	});
}

describe('./src/dynamic-forms/dynamic-components/single-line-input/question.js', () => {
	it('should create', () => {
		const testQuestion = createMultiFieldInputQuestion();

		expect(testQuestion.title).toEqual(TITLE);
		expect(testQuestion.question).toEqual(QUESTION);
		expect(testQuestion.fieldName).toEqual(FIELDNAME);
		expect(testQuestion.viewFolder).toEqual('multi-field-input');
		expect(testQuestion.validators).toEqual(VALIDATORS);
		expect(testQuestion.html).toEqual(HTML);
		expect(testQuestion.hint).toEqual(HINT);
		expect(testQuestion.label).toEqual(LABEL);
		expect(testQuestion.inputFields).toEqual(INPUTFIELDS);
	});

	it('should throw error if no inputFields parameter is passed to the constructor', () => {
		expect(() => {
			createMultiFieldInputQuestion(
				TITLE,
				QUESTION,
				FIELDNAME,
				VALIDATORS,
				HTML,
				HINT,
				LABEL,
				null
			);
		}).toThrow(new Error('inputFields are mandatory'));
	});

	// describe('getDataToSave', () => {

	// })
});
