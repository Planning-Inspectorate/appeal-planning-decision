const { validationResult } = require('express-validator');
const {
	rules,
	validSiteOwnershipCertBOptions
} = require('../../../../src/validators/appellant-submission/site-ownership-certb');
const { testExpressValidatorMiddleware } = require('../validation-middleware-helper');

jest.mock('../../../../src/services/department.service');

describe('validators/appellant-submission/have-other-owners-been-told-certb', () => {
	describe('rules', () => {
		it('is configured with the expected rules', () => {
			expect(rules().length).toEqual(1);
		});

		describe('ruleSiteOwnershipCertB', () => {
			it('is configured with the expected rules', () => {
				const rule = rules()[0].builder.build();

				expect(rule.fields).toEqual(['have-other-owners-been-told']);
				expect(rule.locations).toEqual(['body']);
				expect(rule.optional).toBeFalsy();
				expect(rule.stack).toHaveLength(3);

				expect(rule.stack[0].negated).toBeTruthy();
				expect(rule.stack[0].validator.name).toEqual('isEmpty');
				expect(rule.stack[0].message).toEqual('Select yes if you have told the other owners');

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
					expect(result.errors[0].msg).toEqual('Select yes if you have told the other owners');
					expect(result.errors[0].path).toEqual('have-other-owners-been-told');
					expect(result.errors[0].value).toEqual(undefined);
				}
			},
			{
				title: 'invalid value for `have-other-owners-been-told` - fail',
				given: () => ({
					body: {
						'have-other-owners-been-told': 91
					}
				}),
				expected: (result) => {
					expect(result.errors).toHaveLength(1);
					expect(result.errors[0].location).toEqual('body');
					expect(result.errors[0].msg).toEqual('Invalid value');
					expect(result.errors[0].path).toEqual('have-other-owners-been-told');
					expect(result.errors[0].value).toEqual(91);
				}
			},
			{
				title: 'valid value for `have-other-owners-been-told` - "yes" - pass',
				given: () => ({
					body: {
						'have-other-owners-been-told': 'yes'
					}
				}),
				expected: (result) => {
					expect(result.errors).toHaveLength(0);
				}
			},
			{
				title: 'valid value for `have-other-owners-been-told` - "no" - pass',
				given: () => ({
					body: {
						'have-other-owners-been-told': 'no'
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

	describe('validSiteOwnershipCertBOptions', () => {
		it('should define the expected valid site ownership cert B options', () => {
			expect(validSiteOwnershipCertBOptions).toEqual(['yes', 'no']);
		});
	});
});
