const { validationResult } = require('express-validator');
const { rules } = require('../../../../src/validators/common/textfield');
const { testExpressValidatorMiddleware } = require('../validation-middleware-helper');

describe('validators/common/textfield', () => {
	const res = jest.fn();
	const fieldName = 'visible-from-road-details';
	const targetFieldName = 'visible-from-road';
	const emptyError = 'Tell us how visibility is restricted';
	const tooLongError = 'How visibility is restricted must be $maxLength characters or less';

	it('should not return an error if the condition does not match', async () => {
		const req = {
			body: {
				'visible-from-road': 'yes',
				'visible-from-road-details': ''
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

	it('should not return an error if the condition matches with the default conditional value and a valid value is given', async () => {
		const req = {
			body: {
				'visible-from-road': 'no',
				'visible-from-road-details': 'a'.repeat(100)
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

	it('should not return an error if the condition matches with a custom conditional value and a valid value is given', async () => {
		const req = {
			body: {
				'visible-from-road': 'yes',
				'visible-from-road-details': 'a'.repeat(1000)
			}
		};

		await testExpressValidatorMiddleware(
			req,
			res,
			rules({
				fieldName,
				targetFieldName,
				targetFieldValue: 'yes',
				emptyError,
				tooLongError
			})
		);

		const result = validationResult(req);

		expect(result.errors).toHaveLength(0);
	});

	it('should not return an error if a condition is not given and a valid value is given', async () => {
		const req = {
			body: {
				'visible-from-road': 'yes',
				'visible-from-road-details': 'a'.repeat(1000)
			}
		};

		await testExpressValidatorMiddleware(
			req,
			res,
			rules({
				fieldName,
				emptyError,
				tooLongError
			})
		);

		const result = validationResult(req);

		expect(result.errors).toHaveLength(0);
	});

	it('should return an error if no value is given', async () => {
		const req = {
			body: {
				'visible-from-road': 'no',
				'visible-from-road-details': ''
			}
		};

		await testExpressValidatorMiddleware(
			req,
			res,
			rules({
				fieldName,
				emptyError,
				tooLongError
			})
		);

		const result = validationResult(req);

		expect(result.errors).toHaveLength(1);
		expect(result.errors[0].location).toEqual('body');
		expect(result.errors[0].msg).toEqual(emptyError);
		expect(result.errors[0].path).toEqual(fieldName);
		expect(result.errors[0].value).toEqual('');
	});

	it('should return an error with the default max length and a value longer than the max length is given', async () => {
		const fieldValue = 'a'.repeat(1001);
		const req = {
			body: {
				'visible-from-road': 'no',
				'visible-from-road-details': fieldValue
			}
		};

		await testExpressValidatorMiddleware(
			req,
			res,
			rules({
				fieldName,
				emptyError,
				tooLongError
			})
		);

		const result = validationResult(req);

		expect(result.errors).toHaveLength(1);
		expect(result.errors[0].location).toEqual('body');
		expect(result.errors[0].msg).toEqual(
			'How visibility is restricted must be 1000 characters or less'
		);
		expect(result.errors[0].path).toEqual(fieldName);
		expect(result.errors[0].value).toEqual(fieldValue);
	});

	it('should return an error with a custom max length and a value longer than the max length is given', async () => {
		const fieldValue = 'a'.repeat(101);
		const req = {
			body: {
				'visible-from-road': 'no',
				'visible-from-road-details': fieldValue
			}
		};

		await testExpressValidatorMiddleware(
			req,
			res,
			rules({
				fieldName,
				emptyError,
				tooLongError,
				maxLength: 100
			})
		);

		const result = validationResult(req);

		expect(result.errors).toHaveLength(1);
		expect(result.errors[0].location).toEqual('body');
		expect(result.errors[0].msg).toEqual(
			'How visibility is restricted must be 100 characters or less'
		);
		expect(result.errors[0].path).toEqual(fieldName);
		expect(result.errors[0].value).toEqual(fieldValue);
	});
});
