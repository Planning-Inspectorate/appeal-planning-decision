const { validationResult } = require('express-validator');
const { testExpressValidatorMiddleware } = require('../validation-middleware-helper');
const { rules } = require('../../../../src/validators/common/check-id-is-mongodb-object-id');

describe('validators/common/check-id-is-mongodb-object-id', () => {
	describe('rules', () => {
		it(`has a rule for the user's id`, () => {
			const rule = rules()[0].builder.build();
			expect(rule.fields).toEqual(['id']);
			expect(rule.locations).toEqual(['params']);
			expect(rule.optional).toBeFalsy();
			expect(rule.stack).toHaveLength(1);
			expect(rule.stack[0].message).toEqual('User ID is not in a valid format');
		});

		it('should have an array containing 1 rule', () => {
			expect(rules().length).toEqual(1);
		});
		it('should validate a valid user id req param', async () => {
			const req = {
				params: {
					id: '45cbc4a0e4123f6920000002'
				}
			};

			const res = jest.fn();
			const fieldName = 'id';
			const targetFieldName = 'id';
			const invalidError = '';

			await testExpressValidatorMiddleware(
				req,
				res,
				rules({
					fieldName,
					targetFieldName,
					invalidError
				})
			);

			const result = validationResult(req);

			expect(result.errors).toHaveLength(0);
		});
		it('should invalidate an invalid user id req param', async () => {
			const req = {
				params: {
					id: 'fce1c00c-473b-4329-9767-0bc53d6d957c'
				}
			};

			const res = jest.fn();
			const fieldName = 'id';
			const targetFieldName = 'id';
			const invalidError = '';

			await testExpressValidatorMiddleware(
				req,
				res,
				rules({
					fieldName,
					targetFieldName,
					invalidError
				})
			);

			const result = validationResult(req);

			expect(result.errors).toHaveLength(1);
			expect(result.errors[0].msg).toEqual('User ID is not in a valid format');
		});
	});
});
