const { validationResult } = require('express-validator');
const { buildCheckboxValidation } = require('../../../../src/validators/common/checkboxes');

describe('validators/common/checkboxes', () => {
	let req;
	const res = {};
	const next = jest.fn();

	beforeEach(() => {
		req = { body: {} };
	});

	const fieldName = 'test-field';
	const checkboxOptions = ['option1', 'option2', 'option3'];

	const validator = buildCheckboxValidation(fieldName, checkboxOptions)[0];

	it('should pass validation when all options selected', async () => {
		req = {
			body: {
				[fieldName]: checkboxOptions
			}
		};

		await validator(req, res, next);

		const result = validationResult(req);

		expect(result.errors).toHaveLength(0);
	});

	it('should not fail validation if not all options selected', async () => {
		req = {
			body: {
				[fieldName]: [checkboxOptions[0], checkboxOptions[1]]
			}
		};

		await validator(req, res, next);

		const result = validationResult(req);

		expect(result.errors).toHaveLength(0);
	});

	it('should not fail validation when there is no selection', async () => {
		await validator(req, res, next);

		const result = validationResult(req);

		expect(result.errors).toHaveLength(0);
	});

	it('should fail validation if request contains an incorrect option', async () => {
		req = {
			body: {
				[fieldName]: ['anIncorrectValue']
			}
		};

		await validator(req, res, next);
		const result = validationResult(req);

		expect(result.errors).toHaveLength(1);
		expect(result.errors).toEqual([
			{
				value: req.body[fieldName],
				msg: `Invalid option(s) received`,
				path: fieldName,
				type: 'field',
				location: 'body'
			}
		]);
	});
});

describe('validators/full-appeal/telling-the-landowners', () => {
	let req;
	const res = {};
	const next = jest.fn();

	beforeEach(() => {
		req = { body: {} };
	});

	const fieldName = 'test-field';
	const checkboxOptions = ['option1', 'option2', 'option3'];
	const notEmptyMessage = 'Can not be empty';
	const allMandatoryMessage = 'All options should be selected';

	const validator = buildCheckboxValidation(fieldName, checkboxOptions, {
		notEmptyMessage,
		allMandatoryMessage
	})[0];

	it('should pass validation when all options selected', async () => {
		req = {
			body: {
				[fieldName]: checkboxOptions
			}
		};

		await validator(req, res, next);

		const result = validationResult(req);

		expect(result.errors).toHaveLength(0);
	});

	it('should fail validation if not all options selected', async () => {
		req = {
			body: {
				[fieldName]: [checkboxOptions[0], checkboxOptions[1]]
			}
		};

		await validator(req, res, next);

		const result = validationResult(req);

		expect(result.errors).toHaveLength(1);
		expect(result.errors).toEqual([
			{
				msg: allMandatoryMessage,
				path: fieldName,
				type: 'field',
				location: 'body',
				value: [checkboxOptions[0], checkboxOptions[1]]
			}
		]);
	});

	it('should fail validation when there is no selection', async () => {
		await validator(req, res, next);

		const result = validationResult(req);

		expect(result.errors).toHaveLength(1);
		expect(result.errors).toEqual([
			{
				value: undefined,
				msg: notEmptyMessage,
				path: fieldName,
				type: 'field',
				location: 'body'
			}
		]);
	});

	it('should fail validation if request contains an incorrect option', async () => {
		req = {
			body: {
				[fieldName]: ['anIncorrectValue']
			}
		};

		await validator(req, res, next);
		const result = validationResult(req);

		expect(result.errors).toHaveLength(1);
		expect(result.errors).toEqual([
			{
				value: req.body[fieldName],
				msg: `Invalid option(s) received`,
				path: fieldName,
				type: 'field',
				location: 'body'
			}
		]);
	});
});
