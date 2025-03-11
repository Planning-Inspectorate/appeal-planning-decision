const { validationResult } = require('express-validator');
const { testExpressValidatorMiddleware } = require('../validation-middleware-helper');
const { rules } = require('../../../../src/validators/common/email-address');

describe('validators/common/email-address', () => {
	describe('rules', () => {
		it(`has a rule for the appellant's email`, () => {
			const rule = rules()[0].builder.build();
			expect(rule.fields).toEqual(['appellant-email']);
			expect(rule.locations).toEqual(['body']);
			expect(rule.optional).toBeFalsy();
			expect(rule.stack).toHaveLength(8);
			expect(rule.stack[0].message).toEqual('Enter your email address');
			expect(rule.stack[3].validator.name).toEqual('isEmail');
		});

		it('should have an array containing rule', () => {
			expect(rules().length).toEqual(1);
			expect(rules()[0].builder.fields[0]).toEqual('appellant-email');
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
					expect(result.errors[0].msg).toEqual('Enter your email address');
					expect(result.errors[0].param).toEqual('appellant-email');
					expect(result.errors[0].value).toEqual(undefined);
				}
			},
			{
				title: 'invalid value 1 - fail, incorrect format',
				given: () => ({
					body: {
						'appellant-email': '@.com'
					}
				}),
				expected: (result) => {
					expect(result.errors).toHaveLength(1);
					expect(result.errors[0].location).toEqual('body');
					expect(result.errors[0].msg).toEqual(
						'Enter an email address in the correct format, like name@example.com'
					);
					expect(result.errors[0].param).toEqual('appellant-email');
					expect(result.errors[0].value).toEqual('@.com');
				}
			},
			{
				title: 'invalid value 2 - fail, incorrect format',
				given: () => ({
					body: {
						'appellant-email': 13
					}
				}),
				expected: (result) => {
					expect(result.errors).toHaveLength(1);

					expect(result.errors[0].location).toEqual('body');
					expect(result.errors[0].msg).toEqual(
						'Enter an email address in the correct format, like name@example.com'
					);
					expect(result.errors[0].param).toEqual('appellant-email');
					expect(result.errors[0].value).toEqual('13');
				}
			},

			{
				title: 'invalid email - fail 1',
				given: () => ({
					body: {
						'appellant-email': 'thomas-@example.com'
					}
				}),
				expected: (result) => {
					expect(result.errors).toHaveLength(1);
					expect(result.errors[0].location).toEqual('body');
					expect(result.errors[0].msg).toEqual(
						'Enter an email address in the correct format, like name@example.com'
					);
					expect(result.errors[0].param).toEqual('appellant-email');
					expect(result.errors[0].value).toEqual('thomas-@example.com');
				}
			},
			{
				title: 'invalid email - fail 2',
				given: () => ({
					body: {
						'appellant-email': 'thomas@example.c'
					}
				}),
				expected: (result) => {
					expect(result.errors).toHaveLength(1);
					expect(result.errors[0].location).toEqual('body');
					expect(result.errors[0].msg).toEqual(
						'Enter an email address in the correct format, like name@example.com'
					);
					expect(result.errors[0].param).toEqual('appellant-email');
					expect(result.errors[0].value).toEqual('thomas@example.c');
				}
			},
			{
				title: 'valid values - pass',
				given: () => ({
					body: {
						'appellant-email': 'timmy@example.com'
					}
				}),
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
