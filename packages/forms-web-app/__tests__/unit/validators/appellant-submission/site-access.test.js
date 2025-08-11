const { validationResult } = require('express-validator');
const {
	rules,
	validSiteAccessOptions
} = require('../../../../src/validators/appellant-submission/site-access');
const { testExpressValidatorMiddleware } = require('../validation-middleware-helper');

describe('validators/appellant-submission/site-access', () => {
	describe('rules', () => {
		it('is configured with the expected rules', () => {
			expect(rules().length).toEqual(2);
		});

		describe('ruleSiteAccess', () => {
			it('is configured with the expected rules', () => {
				const rule = rules()[0].builder.build();

				expect(rule.fields).toEqual(['site-access']);
				expect(rule.locations).toEqual(['body']);
				expect(rule.optional).toBeFalsy();
				expect(rule.stack).toHaveLength(3);

				expect(rule.stack[0].negated).toBeTruthy();
				expect(rule.stack[0].validator.name).toEqual('isEmpty');
				expect(rule.stack[0].message).toEqual(
					'Select Yes if the appeal site can be seen from a public road'
				);

				expect(rule.stack[2].negated).toBeFalsy();
				expect(rule.stack[2].validator.name).toEqual('isIn');
				expect(rule.stack[2].options).toEqual([['yes', 'no']]);
			});
		});

		describe('ruleSiteAccessMoreDetail', () => {
			it('is configured with the expected rules', () => {
				const rule = rules()[1].builder.build();

				expect(rule.fields).toEqual(['site-access-more-detail']);
				expect(rule.locations).toEqual(['body']);
				expect(rule.optional).toBeFalsy();
				expect(rule.stack).toHaveLength(4);

				expect(rule.stack[0].chain).toBeDefined();

				expect(rule.stack[1].negated).toBeTruthy();
				expect(rule.stack[1].validator.name).toEqual('isEmpty');
				expect(rule.stack[1].message).toEqual('Tell us how access is restricted');
			});
		});
	});

	describe('validator', () => {
		[
			{
				title: 'No selection made as to the visibility of the site',
				given: () => ({
					body: {}
				}),
				expected: (result) => {
					expect(result.errors).toHaveLength(1);
					expect(result.errors[0].location).toEqual('body');
					expect(result.errors[0].msg).toEqual(
						'Select Yes if the appeal site can be seen from a public road'
					);
					expect(result.errors[0].path).toEqual('site-access');
					expect(result.errors[0].value).toEqual(undefined);
				}
			},
			{
				title: 'Site can be viewed from public highway',
				given: () => ({
					body: {
						'site-access': 'yes'
					}
				}),
				expected: (result) => {
					expect(result.errors).toHaveLength(0);
				}
			},
			{
				title:
					'Site cannot be viewed from public highway, no information provided as to how - `site-access-more-detail` field missing - invalid',
				given: () => ({
					body: {
						'site-access': 'no'
					}
				}),
				expected: (result) => {
					expect(result.errors).toHaveLength(1);
					expect(result.errors[0].location).toEqual('body');
					expect(result.errors[0].msg).toEqual('Tell us how access is restricted');
					expect(result.errors[0].path).toEqual('site-access-more-detail');
					expect(result.errors[0].value).toEqual(undefined);
				}
			},
			{
				title: 'Site cannot be viewed from public highway, information provided as to how - valid',
				given: () => ({
					body: {
						'site-access': 'no',
						'site-access-more-detail': 'I need to open a gate'
					}
				}),
				expected: (result) => {
					expect(result.errors).toHaveLength(0);
				}
			},
			{
				title:
					'Site cannot be viewed from public highway, no information provided as to how - `site-access-more-detail` is empty - invalid',
				given: () => ({
					body: {
						'site-access': 'no',
						'site-access-more-detail': ''
					}
				}),
				expected: (result) => {
					expect(result.errors).toHaveLength(1);
					expect(result.errors[0].location).toEqual('body');
					expect(result.errors[0].msg).toEqual('Tell us how access is restricted');
					expect(result.errors[0].path).toEqual('site-access-more-detail');
					expect(result.errors[0].value).toEqual('');
				}
			},
			{
				title:
					'Site cannot be viewed from public highway, information provided is max length - valid',
				given: () => ({
					body: {
						'site-access': 'no',
						'site-access-more-detail': 'x'.repeat(1000)
					}
				}),
				expected: (result) => {
					expect(result.errors).toHaveLength(0);
				}
			},
			{
				title:
					'Site cannot be viewed from public highway, information provided exceeds max length - invalid',
				given: () => ({
					body: {
						'site-access': 'no',
						'site-access-more-detail': 'x'.repeat(1001)
					}
				}),
				expected: (result) => {
					expect(result.errors).toHaveLength(1);
					expect(result.errors[0].location).toEqual('body');
					expect(result.errors[0].msg).toEqual(
						'How access is restricted must be 1000 characters or less'
					);
					expect(result.errors[0].path).toEqual('site-access-more-detail');
					expect(result.errors[0].value).toEqual('x'.repeat(1001));
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

	describe('validSiteAccessOptions', () => {
		it('should define the expected valid site access options', () => {
			expect(validSiteAccessOptions).toEqual(['yes', 'no']);
		});
	});
});
