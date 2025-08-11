const { validationResult } = require('express-validator');
const { rules } = require('../../../../src/validators/common/enter-code');
const { testExpressValidatorMiddleware } = require('../validation-middleware-helper');

describe('validators/common/enter-code', () => {
	const res = jest.fn();
	const fieldName = 'email-code';
	const targetFieldName = 'email-code';
	const emptyError = 'Enter the code we sent to your email address';
	const tooLongError = 'How visibility is restricted must be $maxLength characters or less';

	it('not enough characters entered', async () => {
		const req = {
			body: {
				'email-code': 'a1'
			}
		};

		await testExpressValidatorMiddleware(
			req,
			res,
			rules({
				fieldName,
				targetFieldName,
				emptyError,
				tooLongError
			})
		);

		const result = validationResult(req);
		expect(result.errors).toHaveLength(1);
		expect(result.errors[0].location).toEqual('body');
		expect(result.errors[0].msg).toEqual(emptyError);
		expect(result.errors[0].path).toEqual('email-code');
	});
	it('too many characters entered', async () => {
		const req = {
			body: {
				'email-code': 'b1c2d3'
			}
		};

		await testExpressValidatorMiddleware(
			req,
			res,
			rules({
				fieldName,
				targetFieldName,
				emptyError,
				tooLongError
			})
		);

		const result = validationResult(req);
		expect(result.errors).toHaveLength(1);
		expect(result.errors[0].location).toEqual('body');
		expect(result.errors[0].msg).toEqual(emptyError);
		expect(result.errors[0].path).toEqual('email-code');
	});
	it('invalid non alphanumeric characters entered', async () => {
		const req = {
			body: {
				'email-code': '====='
			}
		};

		await testExpressValidatorMiddleware(
			req,
			res,
			rules({
				fieldName,
				targetFieldName,
				emptyError,
				tooLongError
			})
		);

		const result = validationResult(req);
		expect(result.errors).toHaveLength(1);
		expect(result.errors[0].location).toEqual('body');
		expect(result.errors[0].msg).toEqual(emptyError);
		expect(result.errors[0].path).toEqual('email-code');
	});
	it('no characters entered', async () => {
		const req = {
			body: {
				'email-code': ''
			}
		};

		await testExpressValidatorMiddleware(
			req,
			res,
			rules({
				fieldName,
				targetFieldName,
				emptyError,
				tooLongError
			})
		);

		const result = validationResult(req);
		expect(result.errors).toHaveLength(1);
		expect(result.errors[0].location).toEqual('body');
		expect(result.errors[0].msg).toEqual(emptyError);
		expect(result.errors[0].path).toEqual('email-code');
	});

	it('valid characters entered', async () => {
		const req = {
			body: {
				'email-code': '12345'
			}
		};

		await testExpressValidatorMiddleware(
			req,
			res,
			rules({
				fieldName,
				targetFieldName,
				emptyError,
				tooLongError
			})
		);

		const result = validationResult(req);
		expect(result.errors).toHaveLength(0);
	});
});
