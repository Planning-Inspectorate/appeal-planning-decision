const validate = require('./validator');

const RequiredValidator = require('./required-validator');
const ValidOptionValidator = require('./valid-option-validator');
const ListAddMoreQuestion = require('../dynamic-components/list-add-more/question');
const AddMoreQuestion = require('../dynamic-components/add-more/question');
const AddressValidator = require('./address-validator');

jest.mock('../journey-factory');

describe('./src/dynamic-forms/validator/validator.js', () => {
	let mockRes;
	beforeEach(() => {
		jest.resetAllMocks();
		mockRes = {
			locals: {
				journeyResponse: {},
				journey: {
					getQuestionBySectionAndName: function () {
						return null;
					}
				}
			}
		};
	});

	it('should error with invalid question', async () => {
		const req = {
			params: {},
			body: {}
		};

		const next = jest.fn();
		let error = null;
		try {
			await validate()(req, mockRes, next);
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

		mockRes.locals.journey = {
			getQuestionBySectionAndName: function () {
				return {
					validators: [new RequiredValidator()],
					fieldName: 'field1'
				};
			}
		};

		const next = jest.fn();
		await validate()(req, mockRes, next);

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

		mockRes.locals.journey = {
			getQuestionBySectionAndName: function () {
				return {
					validators: [new RequiredValidator()],
					fieldName: 'field1'
				};
			}
		};

		const next = jest.fn();
		await validate()(req, mockRes, next);

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

		mockRes.locals.journey = {
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
		};

		const next = jest.fn();
		await validate()(req, mockRes, next);

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

		mockRes.locals.journey = {
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
		};

		const next = jest.fn();
		await validate()(req, mockRes, next);

		expect(req['express-validator#contexts'][1]._errors.length).toEqual(1);
		expect(next).toHaveBeenCalledTimes(1);
	});

	it('should validate add more question', async () => {
		const req = {
			params: {
				section: 1,
				question: 1,
				referenceId: 'abc'
			},
			body: {
				field2: ''
			}
		};

		mockRes.locals.journey = {
			getQuestionBySectionAndName: function () {
				return new ListAddMoreQuestion({
					title: 'title',
					question: 'question',
					validators: [],
					fieldName: 'field1',
					subQuestion: new AddMoreQuestion({
						pageTitle: 'test',
						title: 'sub-title',
						question: 'sub-question',
						viewFolder: 'sub-view',
						fieldName: 'field2',
						validators: [new RequiredValidator()]
					})
				});
			}
		};

		const next = jest.fn();
		await validate()(req, mockRes, next);
		expect(req['express-validator#contexts'][0]._errors.length).toEqual(1);
		expect(next).toHaveBeenCalledTimes(1);
	});

	it('should not validate subquestion if on the add more page', async () => {
		const req = {
			params: {
				section: 1,
				question: 1,
				referenceId: 'abc'
			},
			body: {
				field2: '',
				'add-more-question': ''
			}
		};

		mockRes.locals.journey = {
			getQuestionBySectionAndName: function () {
				return {
					validators: [],
					fieldName: 'field1',
					subQuestion: {
						validators: [new RequiredValidator()],
						fieldName: 'field2'
					}
				};
			}
		};

		const next = jest.fn();
		await validate()(req, mockRes, next);

		expect(req['express-validator#contexts']).toEqual(undefined);
		expect(next).toHaveBeenCalledTimes(1);
	});

	it('should validate question if on the add more page', async () => {
		const req = {
			params: {
				section: 1,
				question: 1,
				referenceId: 'abc'
			},
			body: {
				field2: '',
				'add-more-question': ''
			}
		};

		mockRes.locals.journey = {
			getQuestionBySectionAndName: function () {
				return {
					validators: [new RequiredValidator()],
					fieldName: 'field1',
					subQuestion: {
						validators: [new RequiredValidator()],
						fieldName: 'field2'
					}
				};
			}
		};

		const next = jest.fn();
		await validate()(req, mockRes, next);

		expect(req['express-validator#contexts'][0]._errors.length).toEqual(1);
		expect(next).toHaveBeenCalledTimes(1);
	});

	it('can handle a validator that returns array of validation rules', async () => {
		const req = {
			params: {
				section: 1,
				question: 1,
				referenceId: 'abc'
			},
			body: {
				field1_addressLine1: '',
				field1_townCity: ''
			}
		};

		mockRes.locals.journey = {
			getQuestionBySectionAndName: function () {
				return {
					validators: [new AddressValidator()],
					fieldName: 'field1'
				};
			}
		};

		const next = jest.fn();
		await validate()(req, mockRes, next);

		const validatorContexts = req['express-validator#contexts'];

		const getContext = (field) => validatorContexts.find((context) => context.fields[0] === field);
		const addressLine1 = getContext('field1_addressLine1');
		const addressLine2 = getContext('field1_addressLine2');
		const townCity = getContext('field1_townCity');
		const postcode = getContext('field1_postcode');

		expect(addressLine1._errors.length).toEqual(1);
		expect(addressLine2._errors.length).toEqual(0);
		expect(townCity._errors.length).toEqual(1);
		expect(postcode._errors.length).toEqual(1);
		expect(next).toHaveBeenCalledTimes(1);
	});
});
