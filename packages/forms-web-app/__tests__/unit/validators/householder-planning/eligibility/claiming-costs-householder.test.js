const { validationResult } = require('express-validator');
const {
	rules
} = require('../../../../../src/validators/householder-planning/eligibility/claiming-costs-householder');
const { testExpressValidatorMiddleware } = require('../../validation-middleware-helper');

describe('validators/planning-department', () => {
	describe('rules', () => {
		it('is configured with the expected rules', () => {
			const rule = rules()[0].builder.build();

			expect(rules().length).toEqual(1);
			expect(rule.fields).toEqual(['claiming-costs-householder']);
			expect(rule.locations).toEqual(['body']);
			expect(rule.optional).toBeFalsy();
			expect(rule.stack).toHaveLength(2);
			expect(rule.stack[0].message).toEqual(
				'Select yes if you are claiming costs as part of your appeal'
			);
		});
	});
	describe('validator', () => {
		[
			{
				title: 'no error yes',
				given: () => ({
					body: {
						'claiming-costs-householder': 'yes'
					}
				}),
				expected: (result) => {
					expect(result.errors).toHaveLength(0);
				}
			},
			{
				title: 'no error no',
				given: () => ({
					body: {
						'claiming-costs-householder': 'yes'
					}
				}),
				expected: (result) => {
					expect(result.errors).toHaveLength(0);
				}
			},
			{
				title: 'error',
				given: () => ({
					body: {
						'claiming-costs-householder': ''
					}
				}),
				expected: (result) => {
					expect(result.errors).toHaveLength(1);
					expect(result.errors[0].location).toEqual('body');
					expect(result.errors[0].msg).toEqual(
						'Select yes if you are claiming costs as part of your appeal'
					);
					expect(result.errors[0].path).toEqual('claiming-costs-householder');
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
