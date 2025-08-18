const { validationResult } = require('express-validator');
const {
	rules,
	validSiteOwnershipOptions
} = require('../../../../src/validators/appellant-submission/site-ownership');
const { testExpressValidatorMiddleware } = require('../validation-middleware-helper');

jest.mock('../../../../src/services/department.service');

describe('validators/appellant-submission/site-ownership', () => {
	describe('rules', () => {
		it('is configured with the expected rules', () => {
			expect(rules().length).toEqual(1);
		});

		describe('ruleSiteOwnership', () => {
			it('is configured with the expected rules', () => {
				const rule = rules()[0].builder.build();

				expect(rule.fields).toEqual(['site-ownership']);
				expect(rule.locations).toEqual(['body']);
				expect(rule.optional).toBeFalsy();
				expect(rule.stack).toHaveLength(3);

				expect(rule.stack[0].negated).toBeTruthy();
				expect(rule.stack[0].validator.name).toEqual('isEmpty');
				expect(rule.stack[0].message).toEqual('Select yes if you own the whole appeal site');

				expect(rule.stack[2].negated).toBeFalsy();
				expect(rule.stack[2].validator.name).toEqual('isIn');
				expect(rule.stack[2].options).toEqual([['yes', 'no']]);
			});
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
					expect(result.errors[0].msg).toEqual('Select yes if you own the whole appeal site');
					expect(result.errors[0].path).toEqual('site-ownership');
					expect(result.errors[0].value).toEqual(undefined);
				}
			},
			{
				title: 'invalid value for `site-ownership` - fail',
				given: () => ({
					body: {
						'site-ownership': 12
					}
				}),
				expected: (result) => {
					expect(result.errors).toHaveLength(1);
					expect(result.errors[0].location).toEqual('body');
					expect(result.errors[0].msg).toEqual('Invalid value');
					expect(result.errors[0].path).toEqual('site-ownership');
					expect(result.errors[0].value).toEqual(12);
				}
			},
			{
				title: 'valid value for `site-ownership` - "yes" - pass',
				given: () => ({
					body: {
						'site-ownership': 'yes'
					}
				}),
				expected: (result) => {
					expect(result.errors).toHaveLength(0);
				}
			},
			{
				title: 'valid value for `site-ownership` - "no" - pass',
				given: () => ({
					body: {
						'site-ownership': 'no'
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

	describe('validSiteOwnershipOptions', () => {
		it('should define the expected valid site ownership options', () => {
			expect(validSiteOwnershipOptions).toEqual(['yes', 'no']);
		});
	});
});
