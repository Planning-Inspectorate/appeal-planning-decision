const { validationResult } = require('express-validator');
const {
	rules,
	validApplicationDecisionOptions
} = require('../../../../src/validators/full-appeal/granted-or-refused');
const { testExpressValidatorMiddleware } = require('../validation-middleware-helper');

describe('validators/full-appeal/granted-or-refused', () => {
	describe('rules', () => {
		it('is configured with the expected rules', () => {
			expect(rules().length).toEqual(1);
		});
	});

	describe('ruleGrantedOrRefused', () => {
		it('is configured with the expected rules', () => {
			const rule = rules()[0].builder.build();

			expect(rule.fields).toEqual(['granted-or-refused']);
			expect(rule.locations).toEqual(['body']);
			expect(rule.optional).toBeFalsy();
			expect(rule.stack).toHaveLength(3);

			expect(rule.stack[0].negated).toBeTruthy();
			expect(rule.stack[0].validator.name).toEqual('isEmpty');
			expect(rule.stack[0].message).toEqual(
				'Select if your planning application was granted or refused, or if you have not received a decision'
			);

			expect(rule.stack[2].negated).toBeFalsy();
			expect(rule.stack[2].validator.name).toEqual('isIn');
			expect(rule.stack[2].options).toEqual([['granted', 'refused', 'nodecisionreceived']]);
		});
	});

	describe('validator', () => {
		[
			{
				title: 'No selection made on the granted or refused application question',
				given: () => ({
					body: {}
				}),
				expected: (result) => {
					expect(result.errors).toHaveLength(1);
					expect(result.errors[0].location).toEqual('body');
					expect(result.errors[0].msg).toEqual(
						'Select if your planning application was granted or refused, or if you have not received a decision'
					);
					expect(result.errors[0].path).toEqual('granted-or-refused');
					expect(result.errors[0].value).toEqual(undefined);
				}
			},
			{
				title: 'User selected `refused` on the full appeal application question',
				given: () => ({
					body: {
						'granted-or-refused': 'refused'
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

	describe('validApplicationDecisionOptions', () => {
		it('should define the expected valid full appeal application status options', () => {
			expect(validApplicationDecisionOptions).toEqual(['granted', 'refused', 'nodecisionreceived']);
		});
	});
});
