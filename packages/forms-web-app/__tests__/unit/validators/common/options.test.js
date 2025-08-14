const { validationResult } = require('express-validator');
const {
	constants: { KNOW_THE_OWNERS }
} = require('@pins/business-rules');
const { rules } = require('../../../../src/validators/common/options');
const { testExpressValidatorMiddleware } = require('../validation-middleware-helper');

describe('validators/common/options', () => {
	const res = jest.fn();
	const fieldName = 'know-the-owners';
	const defaultError = 'Select an option';
	const emptyError = 'Select if you know who owns the rest of the land involved in the appeal';
	const validOptions = Object.values(KNOW_THE_OWNERS);
	const invalidValue = 'invalid-value';

	it('should not return an error if a valid value is given', async () => {
		const req = {
			body: {
				[fieldName]: 'yes'
			}
		};

		await testExpressValidatorMiddleware(req, res, rules({ fieldName }));

		const result = validationResult(req);

		expect(result.errors).toHaveLength(0);
	});

	it('should not return an error if custom options are given and a valid value is given', async () => {
		const req = {
			body: {
				[fieldName]: 'some'
			}
		};

		await testExpressValidatorMiddleware(
			req,
			res,
			rules({
				fieldName,
				validOptions
			})
		);

		const result = validationResult(req);

		expect(result.errors).toHaveLength(0);
	});

	it('should return an error if an value is not given', async () => {
		const req = {
			body: {
				[fieldName]: undefined
			}
		};

		await testExpressValidatorMiddleware(req, res, rules({ fieldName }));

		const result = validationResult(req);

		expect(result.errors).toHaveLength(1);
		expect(result.errors[0].location).toEqual('body');
		expect(result.errors[0].msg).toEqual(defaultError);
		expect(result.errors[0].path).toEqual(fieldName);
		expect(result.errors[0].value).toEqual(undefined);
	});

	it('should return an error if a custom error string is given and an value is not given', async () => {
		const req = {
			body: {
				[fieldName]: undefined
			}
		};

		await testExpressValidatorMiddleware(
			req,
			res,
			rules({
				fieldName,
				emptyError
			})
		);

		const result = validationResult(req);

		expect(result.errors).toHaveLength(1);
		expect(result.errors[0].location).toEqual('body');
		expect(result.errors[0].msg).toEqual(emptyError);
		expect(result.errors[0].path).toEqual(fieldName);
		expect(result.errors[0].value).toEqual(undefined);
	});

	it('should return an error if a custom error function is given and an value is not given', async () => {
		const req = {
			body: {
				[fieldName]: undefined
			}
		};

		await testExpressValidatorMiddleware(
			req,
			res,
			rules({
				fieldName,
				emptyError: () => emptyError
			})
		);

		const result = validationResult(req);

		expect(result.errors).toHaveLength(1);
		expect(result.errors[0].location).toEqual('body');
		expect(result.errors[0].msg).toEqual(emptyError);
		expect(result.errors[0].path).toEqual(fieldName);
		expect(result.errors[0].value).toEqual(undefined);
	});

	it('should return an error if an invalid value is given', async () => {
		const req = {
			body: {
				[fieldName]: invalidValue
			}
		};

		await testExpressValidatorMiddleware(req, res, rules({ fieldName }));

		const result = validationResult(req);

		expect(result.errors).toHaveLength(1);
		expect(result.errors[0].location).toEqual('body');
		expect(result.errors[0].msg).toEqual(defaultError);
		expect(result.errors[0].path).toEqual(fieldName);
		expect(result.errors[0].value).toEqual(invalidValue);
	});
});
