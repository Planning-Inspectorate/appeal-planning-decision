const validate = require('./validator');
const { getJourney, getJourneyResponseByType } = require('../journey-types');

const RequiredValidator = require('./required-validator');
const ValidOptionValidator = require('./valid-option-validator');

jest.mock('../journey-types');

describe('./src/dynamic-forms/validator/validator.js', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it('should error with invalid question', async () => {
		const req = {
			params: {},
			body: {}
		};

		getJourneyResponseByType.mockReturnValue({});
		getJourney.mockReturnValue({
			getQuestionBySectionAndName: function () {
				return null;
			}
		});

		const next = jest.fn();
		let error = null;
		try {
			await validate()(req, {}, next);
		} catch (e) {
			error = e;
		}

		expect(error.message).toEqual('unknown question type');
	});

	it('should validate a single validator', async () => {
		const req = {
			params: {
				section: 1,
				question: 1,
				referenceId: 'abc'
			},
			body: {
				field1: 'bananas'
			}
		};

		getJourneyResponseByType.mockReturnValue({});
		getJourney.mockReturnValue({
			getQuestionBySectionAndName: function () {
				return {
					validators: [new RequiredValidator()],
					fieldName: 'field1'
				};
			}
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
				question: 1,
				referenceId: 'abc'
			},
			body: {
				field1: ''
			}
		};

		getJourneyResponseByType.mockReturnValue({});
		getJourney.mockReturnValue({
			getQuestionBySectionAndName: function () {
				return {
					validators: [new RequiredValidator()],
					fieldName: 'field1'
				};
			}
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

		getJourneyResponseByType.mockReturnValue({});
		getJourney.mockReturnValue({
			getQuestionBySectionAndName: function () {
				return {
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
				};
			}
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

		getJourneyResponseByType.mockReturnValue({});
		getJourney.mockReturnValue({
			getQuestionBySectionAndName: function () {
				return {
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
				};
			}
		});

		const next = jest.fn();
		await validate()(req, {}, next);

		expect(req['express-validator#contexts'][1]._errors.length).toEqual(1);
		expect(next).toHaveBeenCalledTimes(1);
	});
});
