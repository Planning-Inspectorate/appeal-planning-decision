const validate = require('./validator');
const hasJourney = require('../has-questionnaire/journey');
const RequiredValidator = require('./requiredValidator');
const ValidOptionValidator = require('./validOptionValidator');
describe('./src/dynamic-forms/validator/validator.js', () => {
	it('should validate a single validator', async () => {
		const req = {
			params: {
				section: 1,
				question: 1
			},
			body: {
				field1: 'bananas'
			}
		};
		hasJourney.getQuestionBySectionAndName = jest.fn().mockReturnValue({
			validators: [new RequiredValidator()],
			fieldName: 'field1'
		});
		const next = jest.fn();
		await validate()(req, {}, next);
		expect(req['express-validator#contexts'][0]._errors.length).toEqual(0);
		expect(next).toHaveBeenCalledTimes(1);
	});
	it('should invalidate a single validator', async () => {
		const req = {
			params: {
				section: 1,
				question: 1
			},
			body: {
				field1: ''
			}
		};
		hasJourney.getQuestionBySectionAndName = jest.fn().mockReturnValue({
			validators: [new RequiredValidator()],
			fieldName: 'field1'
		});
		const next = jest.fn();
		await validate()(req, {}, next);
		expect(req['express-validator#contexts'][0]._errors.length).toEqual(1);
		expect(next).toHaveBeenCalledTimes(1);
	});
	it('should validate multiple validators', async () => {
		const req = {
			params: {
				section: 1,
				question: 1
			},
			body: {
				field1: 'bananas'
			}
		};
		hasJourney.getQuestionBySectionAndName = jest.fn().mockReturnValue({
			validators: [new RequiredValidator(), new ValidOptionValidator()],
			fieldName: 'field1',
			options: [
				{
					text: 'Apples',
					value: 'apples'
				},
				{
					text: 'Pears',
					value: 'pears'
				},
				{
					text: 'Bananas',
					value: 'bananas'
				}
			]
		});
		const next = jest.fn();
		await validate()(req, {}, next);
		expect(req['express-validator#contexts'][0]._errors.length).toEqual(0);
		expect(next).toHaveBeenCalledTimes(1);
	});
	it('should invalidate some validators', async () => {
		const req = {
			params: {
				section: 1,
				question: 1
			},
			body: {
				field1: 'kumquat'
			}
		};
		hasJourney.getQuestionBySectionAndName = jest.fn().mockReturnValue({
			validators: [new RequiredValidator(), new ValidOptionValidator()],
			fieldName: 'field1',
			options: [
				{
					text: 'Apples',
					value: 'apples'
				},
				{
					text: 'Pears',
					value: 'pears'
				},
				{
					text: 'Bananas',
					value: 'bananas'
				}
			]
		});
		const next = jest.fn();
		await validate()(req, {}, next);
		expect(req['express-validator#contexts'][1]._errors.length).toEqual(1);
		expect(next).toHaveBeenCalledTimes(1);
	});
});
