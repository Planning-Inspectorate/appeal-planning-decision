const { validationResult } = require('express-validator');
const {
	rules,
	validEnforcementNoticeOptions
} = require('../../../../src/validators/before-you-start/enforcement-notice');
const { testExpressValidatorMiddleware } = require('../validation-middleware-helper');

describe('validators/full-appeal/enforcement-notice', () => {
	describe('rules', () => {
		it('is configured with the expected rules', () => {
			expect(rules().length).toEqual(1);
		});

		describe('ruleEnforcementNotice', () => {
			it('is configured with the expected rules', () => {
				const rule = rules()[0].builder.build();

				expect(rule.fields).toEqual(['enforcement-notice']);
				expect(rule.locations).toEqual(['body']);
				expect(rule.optional).toBeFalsy();
				expect(rule.stack).toHaveLength(3);

				expect(rule.stack[0].negated).toBeTruthy();
				expect(rule.stack[0].validator.name).toEqual('isEmpty');
				expect(rule.stack[0].message).toEqual(
					'Select yes if you have received an enforcement notice'
				);

				expect(rule.stack[2].negated).toBeFalsy();
				expect(rule.stack[2].validator.name).toEqual('isIn');
				expect(rule.stack[2].options).toEqual([['yes', 'no']]);
			});
		});
	});

	describe('validator', () => {
		[
			{
				title: 'No selection made regarding receipt of an Enforcement Notice',
				given: () => ({
					body: {}
				}),
				expected: (result) => {
					expect(result.errors).toHaveLength(1);
					expect(result.errors[0].location).toEqual('body');
					expect(result.errors[0].msg).toEqual(
						'Select yes if you have received an enforcement notice'
					);
					expect(result.errors[0].path).toEqual('enforcement-notice');
					expect(result.errors[0].value).toEqual(undefined);
				}
			},
			{
				title: 'User selected `yes` to receiving an Enforcement Notice',
				given: () => ({
					body: {
						'enforcement-notice': 'yes'
					}
				}),
				expected: (result) => {
					expect(result.errors).toHaveLength(0);
				}
			},
			{
				title: 'User selected `no` to receiving an Enforcement Notice',
				given: () => ({
					body: {
						'enforcement-notice': 'no'
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

	describe('validEnforcementNoticeOptions', () => {
		it('should define the expected valid enforcement notice options', () => {
			expect(validEnforcementNoticeOptions).toEqual(['yes', 'no']);
		});
	});
});
