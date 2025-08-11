const { validationResult } = require('express-validator');
const { rules } = require('../../../../src/validators/common/numberfield');
const { testExpressValidatorMiddleware } = require('../validation-middleware-helper');

describe('validators/common/numberfield', () => {
	const res = jest.fn();
	const fieldName = 'expected-days';
	const emptyError = 'Enter how many days you would expect the inquiry to last';
	const invalidError =
		'The days you would expect the inquiry to last must be a whole number between 1 and 999';
	const minLength = 20;
	const maxLength = 30;

	it('should not return an error if a valid value is given', async () => {
		const req = {
			body: {
				[fieldName]: 2
			}
		};

		await testExpressValidatorMiddleware(req, res, rules({ fieldName, emptyError, invalidError }));

		const result = validationResult(req);

		expect(result.errors).toHaveLength(0);
	});

	it('should return an error if a value is not given', async () => {
		const req = {
			body: {
				[fieldName]: undefined
			}
		};

		await testExpressValidatorMiddleware(req, res, rules({ fieldName, emptyError, invalidError }));

		const result = validationResult(req);

		expect(result.errors).toHaveLength(1);
		expect(result.errors[0].location).toEqual('body');
		expect(result.errors[0].msg).toEqual(emptyError);
		expect(result.errors[0].path).toEqual(fieldName);
		expect(result.errors[0].value).toEqual(undefined);
	});

	it('should return an error if not given a numeric value', async () => {
		const value = 'one';
		const req = {
			body: {
				[fieldName]: value
			}
		};

		await testExpressValidatorMiddleware(req, res, rules({ fieldName, emptyError, invalidError }));

		const result = validationResult(req);

		expect(result.errors).toHaveLength(1);
		expect(result.errors[0].location).toEqual('body');
		expect(result.errors[0].msg).toEqual(invalidError);
		expect(result.errors[0].path).toEqual(fieldName);
		expect(result.errors[0].value).toEqual(value);
	});

	it('should return an error if given a decimal value', async () => {
		const value = 1.5;
		const req = {
			body: {
				[fieldName]: value
			}
		};

		await testExpressValidatorMiddleware(req, res, rules({ fieldName, emptyError, invalidError }));

		const result = validationResult(req);

		expect(result.errors).toHaveLength(1);
		expect(result.errors[0].location).toEqual('body');
		expect(result.errors[0].msg).toEqual(invalidError);
		expect(result.errors[0].path).toEqual(fieldName);
		expect(result.errors[0].value).toEqual(value);
	});

	it('should return an error if given a value with leading zeros', async () => {
		const value = '00010';
		const req = {
			body: {
				[fieldName]: value
			}
		};

		await testExpressValidatorMiddleware(req, res, rules({ fieldName, emptyError, invalidError }));

		const result = validationResult(req);

		expect(result.errors).toHaveLength(1);
		expect(result.errors[0].location).toEqual('body');
		expect(result.errors[0].msg).toEqual(invalidError);
		expect(result.errors[0].path).toEqual(fieldName);
		expect(result.errors[0].value).toEqual(value);
	});

	it('should return an error if no min length is given and a value under the default min length is given', async () => {
		const value = 0;
		const req = {
			body: {
				[fieldName]: value
			}
		};

		await testExpressValidatorMiddleware(req, res, rules({ fieldName, emptyError, invalidError }));

		const result = validationResult(req);

		expect(result.errors).toHaveLength(1);
		expect(result.errors[0].location).toEqual('body');
		expect(result.errors[0].msg).toEqual(invalidError);
		expect(result.errors[0].path).toEqual(fieldName);
		expect(result.errors[0].value).toEqual(value);
	});

	it('should return an error if a min length is given and a value under the min length is given', async () => {
		const value = 19;
		const req = {
			body: {
				[fieldName]: value
			}
		};

		await testExpressValidatorMiddleware(
			req,
			res,
			rules({ fieldName, emptyError, invalidError, minLength })
		);

		const result = validationResult(req);

		expect(result.errors).toHaveLength(1);
		expect(result.errors[0].location).toEqual('body');
		expect(result.errors[0].msg).toEqual(invalidError);
		expect(result.errors[0].path).toEqual(fieldName);
		expect(result.errors[0].value).toEqual(value);
	});

	it('should return an error if no max length is given and a value over the default max length is given', async () => {
		const value = 1000;
		const req = {
			body: {
				[fieldName]: value
			}
		};

		await testExpressValidatorMiddleware(req, res, rules({ fieldName, emptyError, invalidError }));

		const result = validationResult(req);

		expect(result.errors).toHaveLength(1);
		expect(result.errors[0].location).toEqual('body');
		expect(result.errors[0].msg).toEqual(invalidError);
		expect(result.errors[0].path).toEqual(fieldName);
		expect(result.errors[0].value).toEqual(value);
	});

	it('should return an error if a max length is given and a value over the max length is given', async () => {
		const value = 31;
		const req = {
			body: {
				[fieldName]: value
			}
		};

		await testExpressValidatorMiddleware(
			req,
			res,
			rules({ fieldName, emptyError, invalidError, maxLength })
		);

		const result = validationResult(req);

		expect(result.errors).toHaveLength(1);
		expect(result.errors[0].location).toEqual('body');
		expect(result.errors[0].msg).toEqual(invalidError);
		expect(result.errors[0].path).toEqual(fieldName);
		expect(result.errors[0].value).toEqual(value);
	});
});
