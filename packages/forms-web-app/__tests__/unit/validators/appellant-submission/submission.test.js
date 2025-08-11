const { validationResult } = require('express-validator');
const { testExpressValidatorMiddleware } = require('../validation-middleware-helper');
const { rules } = require('../../../../src/validators/appellant-submission/submission');

describe('validators/appellant-submission/submission', () => {
	describe('rules', () => {
		it('is configured with the expected rules', () => {
			const rule = rules()[0].builder.build();

			expect(rule.fields).toEqual(['appellant-confirmation']);
			expect(rule.locations).toEqual(['body']);
			expect(rule.optional).toBeFalsy();
			expect(rule.stack).toHaveLength(3);
			expect(rule.stack[0].message).toEqual('Select to confirm you agree');
			expect(rule.stack[2].validator.name).toEqual('equals');
			expect(rule.stack[2].options).toEqual(['i-agree']);
		});

		it('should have the expected number of configured rules', () => {
			expect(rules().length).toEqual(1);
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
					expect(result.errors[0].msg).toEqual('Select to confirm you agree');
					expect(result.errors[0].path).toEqual('appellant-confirmation');
					expect(result.errors[0].value).toEqual(undefined);
				}
			},
			{
				title: 'invalid value - fail',
				given: () => ({
					body: {
						'appellant-confirmation': 12
					}
				}),
				expected: (result) => {
					expect(result.errors).toHaveLength(1);
					expect(result.errors[0].location).toEqual('body');
					expect(result.errors[0].msg).toEqual('Invalid value');
					expect(result.errors[0].path).toEqual('appellant-confirmation');
					expect(result.errors[0].value).toEqual(12);
				}
			},
			{
				title: 'valid value - "i-agree" - pass',
				given: () => ({
					body: {
						'appellant-confirmation': 'i-agree'
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
