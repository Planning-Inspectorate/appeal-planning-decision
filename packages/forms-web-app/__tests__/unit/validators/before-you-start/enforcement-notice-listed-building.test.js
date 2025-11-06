const { validationResult } = require('express-validator');
const {
	rules,
	validEnforcementNoticeListedBuildingOptions
} = require('../../../../src/validators/before-you-start/enforcement-notice-listed-building');
const { testExpressValidatorMiddleware } = require('../validation-middleware-helper');

describe('validators/full-appeal/enforcement-notice-listed-building', () => {
	describe('rules', () => {
		it('is configured with the expected rules', () => {
			expect(rules().length).toEqual(1);
		});

		describe('ruleEnforcementNoticeListedBuilding', () => {
			it('is configured with the expected rules', () => {
				const rule = rules()[0].builder.build();

				expect(rule.fields).toEqual(['enforcement-notice-listed-building']);
				expect(rule.locations).toEqual(['body']);
				expect(rule.optional).toBeFalsy();
				expect(rule.stack).toHaveLength(3);

				expect(rule.stack[0].negated).toBeTruthy();
				expect(rule.stack[0].validator.name).toEqual('isEmpty');
				expect(rule.stack[0].message).toEqual(
					'Select yes if you have received an enforcement notice about a listed building'
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
				title: 'No selection made regarding enforcement notice relating to listed building',
				given: () => ({
					body: {}
				}),
				expected: (result) => {
					expect(result.errors).toHaveLength(1);
					expect(result.errors[0].location).toEqual('body');
					expect(result.errors[0].msg).toEqual(
						'Select yes if you have received an enforcement notice about a listed building'
					);
					expect(result.errors[0].path).toEqual('enforcement-notice-listed-building');
					expect(result.errors[0].value).toEqual(undefined);
				}
			},
			{
				title: 'User selected `yes` to enforcement notice relating to listed building',
				given: () => ({
					body: {
						'enforcement-notice-listed-building': 'yes'
					}
				}),
				expected: (result) => {
					expect(result.errors).toHaveLength(0);
				}
			},
			{
				title: 'User selected `no` to enforcement notice relating to listed building',
				given: () => ({
					body: {
						'enforcement-notice-listed-building': 'no'
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

	describe('validEnforcementNoticeListedBuildingOptions', () => {
		it('should define the expected valid enforcement notice listed building options', () => {
			expect(validEnforcementNoticeListedBuildingOptions).toEqual(['yes', 'no']);
		});
	});
});
