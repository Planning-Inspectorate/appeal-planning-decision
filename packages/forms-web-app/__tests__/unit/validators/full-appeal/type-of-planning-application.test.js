const { validationResult } = require('express-validator');
const {
	constants: { TYPE_OF_PLANNING_APPLICATION }
} = require('@pins/business-rules');
const { rules } = require('../../../../src/validators/full-appeal/type-of-planning-application');
const { testExpressValidatorMiddleware } = require('../validation-middleware-helper');

describe('validators/planning-department', () => {
	describe('rules', () => {
		it('is configured with the expected rules', () => {
			const rule = rules()[0].builder.build();

			expect(rules().length).toEqual(1);
			expect(rule.fields).toEqual(['type-of-planning-application']);
			expect(rule.locations).toEqual(['body']);
			expect(rule.optional).toBeFalsy();
			expect(rule.stack).toHaveLength(3);
			expect(rule.stack[0].message).toEqual(
				'Select which type of planning application your appeal is about, or if you have not made a planning application'
			);
		});
	});
	describe('validator', () => {
		[
			{
				title: 'no error',
				given: () => ({
					body: {
						'type-of-planning-application': TYPE_OF_PLANNING_APPLICATION.FULL_APPEAL
					}
				}),
				expected: (result) => {
					expect(result.errors).toHaveLength(0);
				}
			},
			{
				title: 'error when given no value',
				given: () => ({
					body: {
						'type-of-planning-application': ''
					}
				}),
				expected: (result) => {
					expect(result.errors).toHaveLength(1);
					expect(result.errors[0].location).toEqual('body');
					expect(result.errors[0].msg).toEqual(
						'Select which type of planning application your appeal is about, or if you have not made a planning application'
					);
					expect(result.errors[0].path).toEqual('type-of-planning-application');
				}
			},
			{
				title: 'error when given an invalid value',
				given: () => ({
					body: {
						'type-of-planning-application': 'appeal'
					}
				}),
				expected: (result) => {
					expect(result.errors).toHaveLength(1);
					expect(result.errors[0].location).toEqual('body');
					expect(result.errors[0].msg).toEqual(
						'Select which type of planning application your appeal is about, or if you have not made a planning application'
					);
					expect(result.errors[0].path).toEqual('type-of-planning-application');
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
