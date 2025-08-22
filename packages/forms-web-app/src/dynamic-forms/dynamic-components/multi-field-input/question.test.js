const MultiFieldInputQuestion = require('./question');

const TITLE = 'title';
const QUESTION = 'Question?';
const FIELDNAME = 'field-name';
const VALIDATORS = [1, 2];
const HTML = '/path/to/html.njk';
const HINT = 'hint';
const LABEL = 'A label';
const INPUTFIELDS = [{ fieldName: 'testField1' }, { fieldName: 'testField2' }];

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

	describe('prepQuestionForRendering', () => {
		it('should call super and set inputFields', () => {
			const question = createMultiFieldInputQuestion();

			const journey = {
				journeyId: 'journey1',
				response: {
					answers: {}
				},
				getBackLink: () => {
					return 'back';
				}
			};

			const customViewData = { hello: 'hi' };

			const result = question.prepQuestionForRendering({ section: {}, journey, customViewData });

			expect(result).toEqual(
				expect.objectContaining({
					question: expect.objectContaining({
						fieldName: FIELDNAME,
						inputFields: INPUTFIELDS
					}),
					hello: 'hi'
				})
			);
		});
	});

	describe('getDataToSave', () => {
		it('should return values for all completed fields', async () => {
			const question = createMultiFieldInputQuestion();

			const testRequest = {
				body: {
					testField1: 'testInput',
					testField2: 'more test input',
					notATestField: 'we should not see this'
				}
			};

			const journeyResponse = {
				answers: {}
			};

			const expectedResponseToSave = {
				answers: {
					testField1: 'testInput',
					testField2: 'more test input'
				}
			};

			const result = await question.getDataToSave(testRequest, journeyResponse);

			expect(result).toEqual(expectedResponseToSave);
		});
	});
});
