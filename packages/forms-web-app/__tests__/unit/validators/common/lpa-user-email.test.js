const { validationResult } = require('express-validator');
const { testExpressValidatorMiddleware } = require('../validation-middleware-helper');
const { rules } = require('../../../../src/validators/common/lpa-user-email');

describe('validators/common/lpa-user-email', () => {
	describe('rules', () => {
		it(`has a rule for the email`, () => {
			const rule = rules()[0].builder.build();
			expect(rule.fields).toEqual(['add-user']);
			expect(rule.locations).toEqual(['body']);
			expect(rule.optional).toBeFalsy();
			expect(rule.stack).toHaveLength(1);
			expect(rule.stack[0].message).toEqual('Enter an email address in the correct format');
		});

		it('should have an array containing rule', () => {
			expect(rules().length).toEqual(1);
			expect(rules()[0].builder.fields[0]).toEqual('add-user');
		});
	});

	describe('validator', () => {
		[
			{
				title: 'undefined - empty',
				given: () => ({
					body: {}
				}),
				expected: (result) => {
					expect(result.errors).toHaveLength(1);
					expect(result.errors[0].location).toEqual('body');
					expect(result.errors[0].msg).toEqual('Enter an email address in the correct format');
					expect(result.errors[0].path).toEqual('add-user');
					expect(result.errors[0].value).toEqual(undefined);
				}
			}
		].forEach(({ title, given, expected }) => {
			it(`should return the expected validation outcome - ${title}`, async () => {
				const mockReq = given();
				const mockRes = jest.fn();

				await testExpressValidatorMiddleware(mockReq, mockRes, rules());
				const result = validationResult(mockReq);
				expected(result);
			});
		});
	});
});
