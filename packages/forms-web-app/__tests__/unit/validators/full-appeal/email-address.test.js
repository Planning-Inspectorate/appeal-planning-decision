const { validationResult } = require('express-validator');
const { rules } = require('../../../../src/validators/full-appeal/email-address');
const { testExpressValidatorMiddleware } = require('../validation-middleware-helper');

describe('validators/full-appeal/email-address', () => {
	describe('rules', () => {
		it(`has a rule for email-address`, () => {
			const rule = rules()[0].builder.build();

			expect(rule.fields).toEqual(['email-address']);
			expect(rule.locations).toEqual(['body']);
			expect(rule.optional).toBeFalsy();
		});
	});

	describe('validator', () => {
		[
			{
				title: 'empty email - fail',
				given: () => ({
					body: {
						'email-address': ''
					}
				}),
				expected: (result) => {
					expect(result.errors).toHaveLength(1);
					expect(result.errors[0].location).toEqual('body');
					expect(result.errors[0].msg).toEqual('Enter your email address');
					expect(result.errors[0].path).toEqual('email-address');
				}
			},
			{
				title: 'invalid email - fail',
				given: () => ({
					body: {
						'email-address': 'test'
					}
				}),
				expected: (result) => {
					expect(result.errors).toHaveLength(1);
					expect(result.errors[0].location).toEqual('body');
					expect(result.errors[0].msg).toEqual(
						'Enter an email address in the correct format, like name@example.com'
					);
					expect(result.errors[0].path).toEqual('email-address');
				}
			},
			{
				title: 'valid email - pass',
				given: () => {
					return {
						body: {
							'email-address': 'test@example.com'
						}
					};
				},
				expected: (result) => {
					expect(result.errors).toHaveLength(0);
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
