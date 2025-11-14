const ConfirmationQuestion = require('./question');

const TITLE = 'Confirmation question';
const QUESTION = 'A Confirmation question';
const DESCRIPTION = 'A description of a Confirmation question';
const FIELDNAME = 'confirmation';
const HTML = 'some/html/path';
const LABEL = 'a label';

const confirmationQuestion = new ConfirmationQuestion({
	title: TITLE,
	question: QUESTION,
	description: DESCRIPTION,
	fieldName: FIELDNAME,
	html: HTML,
	label: LABEL
});

/**
 * @typedef {import('../../journey').Journey} Journey
 * @typedef {import('../../section').Section} Section
 */
describe('./src/dynamic-forms/dynamic-components/confirmation/question.js', () => {
	/** @type ConfirmationQuestion */
	let question;
	/** @type Section */
	let section;
	/** @type Journey */
	let journey;

	beforeEach(() => {
		question = confirmationQuestion;
		section = { name: 'section' };
		journey = {
			response: {
				answers: {}
			},
			getBackLink: jest.fn()
		};
	});

	it('should create', () => {
		expect(confirmationQuestion.title).toEqual(TITLE);
		expect(confirmationQuestion.question).toEqual(QUESTION);
		expect(confirmationQuestion.description).toEqual(DESCRIPTION);
		expect(confirmationQuestion.fieldName).toEqual(FIELDNAME);
		expect(confirmationQuestion.viewFolder).toEqual('confirmation');
		expect(confirmationQuestion.html).toEqual(HTML);
		expect(confirmationQuestion.label).toEqual(LABEL);
	});

	describe('prepQuestionForRendering', () => {
		it('should return view model for question', () => {
			const result = question.prepQuestionForRendering({ section, journey });
			expect(result).toEqual(
				expect.objectContaining({
					question: expect.objectContaining({
						label: LABEL
					})
				})
			);
		});
	});

	describe('getDataToSave', () => {
		it('should save fieldName as true', async () => {
			const req = {
				body: {}
			};
			const result = await confirmationQuestion.getDataToSave(req, journey.response);

			expect(result.answers[FIELDNAME]).toBe(true);
			expect(journey.response.answers[FIELDNAME]).toBe(true);
		});

		it('should save additional fields starting with fieldName + "_"', async () => {
			const req = {
				body: {
					[`${FIELDNAME}_extra`]: '  extraValue  ',
					[`${FIELDNAME}_another`]: 'anotherValue'
				}
			};
			const result = await confirmationQuestion.getDataToSave(req, journey.response);

			expect(result.answers[FIELDNAME]).toBe(true);
			expect(result.answers[`${FIELDNAME}_extra`]).toBe('extraValue');
			expect(result.answers[`${FIELDNAME}_another`]).toBe('anotherValue');
			expect(journey.response.answers[`${FIELDNAME}_extra`]).toBe('extraValue');
			expect(journey.response.answers[`${FIELDNAME}_another`]).toBe('anotherValue');
		});
	});
});
