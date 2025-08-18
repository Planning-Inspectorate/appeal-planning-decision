const { validationResult } = require('express-validator');
const {
	rules,
	validSiteAccessSafetyOptions
} = require('../../../../src/validators/appellant-submission/site-access-safety');
const { testExpressValidatorMiddleware } = require('../validation-middleware-helper');

describe('validators/appellant-submission/site-access-safety', () => {
	describe('rules', () => {
		it('is configured with the expected rules', () => {
			expect(rules().length).toEqual(2);
		});

		describe('ruleSiteAccessSafety', () => {
			it('is configured with the expected rules', () => {
				const rule = rules()[0].builder.build();

				expect(rule.fields).toEqual(['site-access-safety']);
				expect(rule.locations).toEqual(['body']);
				expect(rule.optional).toBeFalsy();
				expect(rule.stack).toHaveLength(3);

				expect(rule.stack[0].negated).toBeTruthy();
				expect(rule.stack[0].validator.name).toEqual('isEmpty');
				expect(rule.stack[0].message).toEqual(
					'Select yes if there are any health and safety issues'
				);

				expect(rule.stack[2].negated).toBeFalsy();
				expect(rule.stack[2].validator.name).toEqual('isIn');
				expect(rule.stack[2].options).toEqual([['yes', 'no']]);
			});
		});

		describe('ruleSiteAccessSafetyConcerns', () => {
			it('is configured with the expected rules', () => {
				const rule = rules()[1].builder.build();

				expect(rule.fields).toEqual(['site-access-safety-concerns']);
				expect(rule.locations).toEqual(['body']);
				expect(rule.optional).toBeFalsy();
				expect(rule.stack).toHaveLength(4);

				expect(rule.stack[0].chain).toBeDefined();

				expect(rule.stack[1].negated).toBeTruthy();
				expect(rule.stack[1].validator.name).toEqual('isEmpty');
				expect(rule.stack[1].message).toEqual('Tell us about the health and safety issues');
			});
		});
	});

	describe('validator', () => {
		[
			{
				title: 'No selection made as to the health and safety issues on the appeal site',
				given: () => ({
					body: {}
				}),
				expected: (result) => {
					expect(result.errors).toHaveLength(1);
					expect(result.errors[0].location).toEqual('body');
					expect(result.errors[0].msg).toEqual(
						'Select yes if there are any health and safety issues'
					);
					expect(result.errors[0].path).toEqual('site-access-safety');
					expect(result.errors[0].value).toEqual(undefined);
				}
			},
			{
				title: 'There are no health and safety issues on the appeal site',
				given: () => ({
					body: {
						'site-access-safety': 'no'
					}
				}),
				expected: (result) => {
					expect(result.errors).toHaveLength(0);
				}
			},
			{
				title:
					'There are health and safety issues on the appeal site, but `site-access-safety-concerns` is undefined',
				given: () => ({
					body: {
						'site-access-safety': 'yes'
					}
				}),
				expected: (result) => {
					expect(result.errors).toHaveLength(1);
					expect(result.errors[0].location).toEqual('body');
					expect(result.errors[0].msg).toEqual('Tell us about the health and safety issues');
					expect(result.errors[0].path).toEqual('site-access-safety-concerns');
					expect(result.errors[0].value).toEqual(undefined);
				}
			},
			{
				title:
					'There are health and safety issues on the appeal site, but `site-access-safety-concerns` is empty',
				given: () => ({
					body: {
						'site-access-safety': 'yes',
						'site-access-safety-concerns': ''
					}
				}),
				expected: (result) => {
					expect(result.errors).toHaveLength(1);
					expect(result.errors[0].location).toEqual('body');
					expect(result.errors[0].msg).toEqual('Tell us about the health and safety issues');
					expect(result.errors[0].path).toEqual('site-access-safety-concerns');
					expect(result.errors[0].value).toEqual('');
				}
			},
			{
				title:
					'There are health and safety issues on the appeal site, but the concerns message is too long',
				given: () => ({
					body: {
						'site-access-safety': 'yes',
						'site-access-safety-concerns': 'x'.repeat(1001)
					}
				}),
				expected: (result) => {
					expect(result.errors).toHaveLength(1);
					expect(result.errors[0].location).toEqual('body');
					expect(result.errors[0].msg).toEqual(
						'Health and safety information must be 1000 characters or fewer'
					);
					expect(result.errors[0].path).toEqual('site-access-safety-concerns');
					expect(result.errors[0].value).toEqual('x'.repeat(1001));
				}
			},
			{
				title:
					'There are health and safety issues on the appeal site and `site-access-safety-concerns` is provided',
				given: () => ({
					body: {
						'site-access-safety': 'yes',
						'site-access-safety-concerns': 'some safety concerns here'
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

	describe('validSiteAccessSafetyOptions', () => {
		it('should define the expected valid site access safety options', () => {
			expect(validSiteAccessSafetyOptions).toEqual(['yes', 'no']);
		});
	});
});
