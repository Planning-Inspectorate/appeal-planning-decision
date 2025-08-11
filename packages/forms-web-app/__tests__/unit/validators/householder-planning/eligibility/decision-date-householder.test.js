jest.mock('../../../../../src/validators/custom/date-input', () => jest.fn());

const { validationResult } = require('express-validator');
const {
	rules
} = require('../../../../../src/validators/householder-planning/eligibility/decision-date-householder');
const { testExpressValidatorMiddleware } = require('../../validation-middleware-helper');

describe('validators/householder-planning/decision-date-householder', () => {
	describe('rules', () => {
		it(`has a rule for days in the future`, () => {
			const rule = rules()[0].builder.build();

			expect(rule.fields).toEqual(['decision-date-householder']);
			expect(rule.locations).toEqual(['body']);
			expect(rule.optional).toBeFalsy();
			expect(rule.stack[0].negated).toBeFalsy();
		});
	});

	describe('validator', () => {
		[
			{
				title: 'invalid (in future) - fail',
				given: () => ({
					body: {
						'decision-date-householder-year': '2130',
						'decision-date-householder-month': '06',
						'decision-date-householder-day': '11'
					}
				}),
				expected: (result) => {
					expect(result.errors).toHaveLength(1);
					expect(result.errors[0].location).toEqual('body');
					expect(result.errors[0].msg).toEqual('Decision date must be today or in the past');
					expect(result.errors[0].path).toEqual('decision-date-householder');
				}
			},
			{
				title: 'valid date - same day - pass',
				given: () => {
					const now = new Date();
					return {
						body: {
							'decision-date-householder': `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`
						}
					};
				},
				expected: (result) => {
					expect(result.errors).toHaveLength(0);
				}
			},
			{
				title: 'valid date - pass',
				given: () => {
					const now = new Date();
					return {
						body: {
							'decision-date-householder': `${now.getFullYear()}-${
								now.getMonth() + 1
							}-${now.getDate()}`
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
