const BooleanQuestion = require('./question');
const { numericFields } = require('../../dynamic-components/utils/numeric-fields');

describe('./src/dynamic-forms/dynamic-components/boolean/question.js', () => {
	it('should create', () => {
		const TITLE = 'A boolean question';
		const QUESTION = 'Do you like Tina Turner, Ted?';
		const DESCRIPTION = 'Tina Turner question';
		const FIELDNAME = 'likeTinaTurner';
		const HTML = 'some/path.html';
		const booleanQuestion = new BooleanQuestion({
			title: TITLE,
			question: QUESTION,
			description: DESCRIPTION,
			fieldName: FIELDNAME,
			html: HTML
		});
		expect(booleanQuestion.title).toEqual(TITLE);
		expect(booleanQuestion.question).toEqual(QUESTION);
		expect(booleanQuestion.description).toEqual(DESCRIPTION);
		expect(booleanQuestion.fieldName).toEqual(FIELDNAME);
		expect(booleanQuestion.html).toEqual(HTML);
		expect(booleanQuestion.options[0].text).toEqual('Yes');
		expect(booleanQuestion.options[0].value).toEqual('yes');
		expect(booleanQuestion.options[1].text).toEqual('No');
		expect(booleanQuestion.options[1].value).toEqual('no');

		const option0 = booleanQuestion.options[0];
		const option1 = booleanQuestion.options[1];

		if (option0 && 'text' in option0 && 'value' in option0) {
			expect(option0.text).toEqual('Yes');
			expect(option0.value).toEqual('yes');
		} else {
			throw new Error('First option is missing expected properties');
		}

		if (option1 && 'text' in option1 && 'value' in option1) {
			expect(option1.text).toEqual('No');
			expect(option1.value).toEqual('no');
		} else {
			throw new Error('Second option is missing expected properties');
		}

		expect(booleanQuestion.viewFolder).toEqual('boolean');
	});

	describe('getDataToSave', () => {
		const FIELDNAME = 'likeTinaTurner';
		/** @type {BooleanQuestion} */
		let booleanQuestion;
		/** @type {Object} */
		let journeyResponse;

		beforeEach(() => {
			booleanQuestion = new BooleanQuestion({
				title: 'A boolean question',
				question: 'Do you like Tina Turner, Ted?',
				description: 'Tina Turner question',
				fieldName: FIELDNAME,
				html: 'some/path.html'
			});
			journeyResponse = { answers: {} };
		});

		it('should save true for "yes" and update journeyResponse', async () => {
			const req = { body: { [FIELDNAME]: 'yes' } };
			const result = await booleanQuestion.getDataToSave(req, journeyResponse);

			expect(result.answers[FIELDNAME]).toBe(true);
			expect(journeyResponse.answers[FIELDNAME]).toBe('yes');
		});

		it('should save false for "no" and update journeyResponse', async () => {
			const req = { body: { [FIELDNAME]: 'no' } };
			const result = await booleanQuestion.getDataToSave(req, journeyResponse);

			expect(result.answers[FIELDNAME]).toBe(false);
			expect(journeyResponse.answers[FIELDNAME]).toBe('no');
		});

		it('should save false for any value other than "yes"', async () => {
			const req = { body: { [FIELDNAME]: 'maybe' } };
			const result = await booleanQuestion.getDataToSave(req, journeyResponse);

			expect(result.answers[FIELDNAME]).toBe(false);
			expect(journeyResponse.answers[FIELDNAME]).toBe('maybe');
		});

		it('should trim the value and save true for " yes "', async () => {
			const req = { body: { [FIELDNAME]: ' yes ' } };
			const result = await booleanQuestion.getDataToSave(req, journeyResponse);

			expect(result.answers[FIELDNAME]).toBe(true);
			expect(journeyResponse.answers[FIELDNAME]).toBe('yes');
		});

		it('should save additional fields starting with fieldName + "_"', async () => {
			const req = {
				body: {
					[FIELDNAME]: 'yes',
					[`${FIELDNAME}_extra`]: '  extraValue  ',
					[`${FIELDNAME}_another`]: 'anotherValue'
				}
			};
			const result = await booleanQuestion.getDataToSave(req, journeyResponse);

			expect(result.answers[FIELDNAME]).toBe(true);
			expect(result.answers[`${FIELDNAME}_extra`]).toBe('extraValue');
			expect(result.answers[`${FIELDNAME}_another`]).toBe('anotherValue');
			expect(journeyResponse.answers[`${FIELDNAME}_extra`]).toBe('extraValue');
			expect(journeyResponse.answers[`${FIELDNAME}_another`]).toBe('anotherValue');
		});
		it('should nullify empty strings for numeric sub-fields', async () => {
			const numericField = `${FIELDNAME}_areaSquareMetres`;
			numericFields.add(numericField);

			const req = {
				body: {
					[FIELDNAME]: 'yes',
					[numericField]: ''
				}
			};
			const result = await booleanQuestion.getDataToSave(req, journeyResponse);

			expect(result.answers[numericField]).toBeNull();
			expect(journeyResponse.answers[numericField]).toBeNull();

			numericFields.delete(numericField);
		});

		it('should convert valid numeric strings to numbers for numeric sub-fields', async () => {
			const numericField = `${FIELDNAME}_areaSquareMetres`;
			numericFields.add(numericField);

			const req = {
				body: {
					[FIELDNAME]: 'no',
					[numericField]: '150.5'
				}
			};
			const result = await booleanQuestion.getDataToSave(req, journeyResponse);

			expect(result.answers[numericField]).toBe(150.5);
			expect(typeof result.answers[numericField]).toBe('number');

			numericFields.delete(numericField);
		});

		it('should continue to trim values for non-numeric sub-fields', async () => {
			const textField = `${FIELDNAME}_details`;

			const req = {
				body: {
					[FIELDNAME]: 'yes',
					[textField]: '  some text details  '
				}
			};
			const result = await booleanQuestion.getDataToSave(req, journeyResponse);

			expect(result.answers[textField]).toBe('some text details');
			expect(typeof result.answers[textField]).toBe('string');
		});
		it('should nullify strings containing only whitespace for numeric sub-fields', async () => {
			const numericField = `${FIELDNAME}_areaSquareMetres`;
			numericFields.add(numericField);

			const req = {
				body: {
					[FIELDNAME]: 'yes',
					[numericField]: '   '
				}
			};
			const result = await booleanQuestion.getDataToSave(req, journeyResponse);

			expect(result.answers[numericField]).toBeNull();
			expect(journeyResponse.answers[numericField]).toBeNull();

			numericFields.delete(numericField);
		});
	});
});
