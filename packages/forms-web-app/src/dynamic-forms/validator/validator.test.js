const validate = require('./validator');
const { getJourney } = require('../journey-factory');

const RequiredValidator = require('./required-validator');
const ValidOptionValidator = require('./valid-option-validator');
const ListAddMoreQuestion = require('../dynamic-components/list-add-more/question');
const Question = require('../question');

jest.mock('../journey-factory');

describe('./src/dynamic-forms/validator/validator.js', () => {
	let mockRes;
	beforeEach(() => {
		jest.resetAllMocks();
		mockRes = {
			locals: {
				journeyResponse: {}
			}
		};
	});

	it('should error with invalid question', async () => {
		const req = {
			params: {},
			body: {}
		};

		getJourney.mockReturnValue({
			getQuestionBySectionAndName: function () {
				return null;
			}
		});

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

		getJourney.mockReturnValue({
			getQuestionBySectionAndName: function () {
				return {
					validators: [new RequiredValidator()],
					fieldName: 'field1'
				};
			}
		});

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

		getJourney.mockReturnValue({
			getQuestionBySectionAndName: function () {
				return {
					validators: [new RequiredValidator()],
					fieldName: 'field1'
				};
			}
		});

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
		await validate()(req, mockRes, next);

		expect(req['express-validator#contexts'][1]._errors.length).toEqual(1);
		expect(next).toHaveBeenCalledTimes(1);
	});

	it('should validate subquestion', async () => {
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

		class TestQuestion extends Question {}

		getJourney.mockReturnValue({
			getQuestionBySectionAndName: function () {
				return new ListAddMoreQuestion({
					title: 'title',
					question: 'question',
					viewFolder: 'view',
					validators: [],
					fieldName: 'field1',
					subQuestion: new TestQuestion({
						pageTitle: 'test',
						title: 'sub-title',
						question: 'sub-question',
						viewFolder: 'sub-view',
						fieldName: 'field2',
						validators: [new RequiredValidator()]
					})
				});
			}
		});

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

		getJourney.mockReturnValue({
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
		});

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

		getJourney.mockReturnValue({
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
		});

		const next = jest.fn();
		await validate()(req, mockRes, next);

		expect(req['express-validator#contexts'][0]._errors.length).toEqual(1);
		expect(next).toHaveBeenCalledTimes(1);
	});
});
