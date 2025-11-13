const { validationResult } = require('express-validator');
const {
	rules,
	validContactPlanningInspectorateOptions
} = require('../../../../src/validators/before-you-start/contact-planning-inspectorate');
const { testExpressValidatorMiddleware } = require('../validation-middleware-helper');

describe('validators/full-appeal/contact-planning-inspectorate', () => {
	describe('rules', () => {
		it('is configured with the expected rules', () => {
			expect(rules().length).toEqual(1);
		});

		describe('ruleContactPlanningInspectorate', () => {
			it('is configured with the expected rules', () => {
				const rule = rules()[0].builder.build();

				expect(rule.fields).toEqual(['contact-planning-inspectorate']);
				expect(rule.locations).toEqual(['body']);
				expect(rule.optional).toBeFalsy();
				expect(rule.stack).toHaveLength(3);

				expect(rule.stack[0].negated).toBeTruthy();
				expect(rule.stack[0].validator.name).toEqual('isEmpty');
				expect(rule.stack[0].message).toEqual(
					'Select yes if you contacted the Planning Inspectorate to tell them you will appeal the enforcement notice'
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
				title: 'No selection made regarding contact planning inspectorate',
				given: () => ({
					body: {}
				}),
				expected: (result) => {
					expect(result.errors).toHaveLength(1);
					expect(result.errors[0].location).toEqual('body');
					expect(result.errors[0].msg).toEqual(
						'Select yes if you contacted the Planning Inspectorate to tell them you will appeal the enforcement notice'
					);
					expect(result.errors[0].path).toEqual('contact-planning-inspectorate');
					expect(result.errors[0].value).toEqual(undefined);
				}
			},
			{
				title: 'User selected `yes` to contact planning inspectorate',
				given: () => ({
					body: {
						'contact-planning-inspectorate': 'yes'
					}
				}),
				expected: (result) => {
					expect(result.errors).toHaveLength(0);
				}
			},
			{
				title: 'User selected `no` to contact planning inspectorate',
				given: () => ({
					body: {
						'contact-planning-inspectorate': 'no'
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

	describe('validContactPlanningInspectorateOptions', () => {
		it('should define the expected valid contact planning inspectorate options', () => {
			expect(validContactPlanningInspectorateOptions).toEqual(['yes', 'no']);
		});
	});
});
