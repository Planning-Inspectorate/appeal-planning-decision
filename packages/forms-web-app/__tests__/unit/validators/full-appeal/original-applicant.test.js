const { validationResult } = require('express-validator');
const { rules } = require('../../../../src/validators/full-appeal/original-applicant');
const { testExpressValidatorMiddleware } = require('../validation-middleware-helper');

describe('validators/full-appeal/original-applicant', () => {
	describe('rules', () => {
		it('is configured with the expected rules', () => {
			expect(rules().length).toEqual(1);
		});

		describe('areYouTheOriginalAppellant', () => {
			it('is configured with the expected rules', () => {
				const rule = rules()[0].builder.build();

				expect(rule.fields).toEqual(['original-application-your-name']);
				expect(rule.locations).toEqual(['body']);
				expect(rule.optional).toBeFalsy();
				expect(rule.stack).toHaveLength(4);

				expect(rule.stack[1].negated).toBeTruthy();
				expect(rule.stack[1].validator.name).toEqual('isEmpty');
				expect(rule.stack[1].message).toEqual(
					'Select yes if the planning application was made in your name'
				);
				expect(rule.stack[3].validator.name).toEqual('isIn');
				expect(rule.stack[3].options).toEqual([['yes', 'no']]);
			});
		});
	});

	describe('validator', () => {
		[
			{
				title: 'No selection made',
				given: () => ({
					body: {}
				}),
				expected: (result) => {
					expect(result.errors).toHaveLength(1);
					expect(result.errors[0].location).toEqual('body');
					expect(result.errors[0].msg).toEqual(
						'Select yes if the planning application was made in your name'
					);
					expect(result.errors[0].path).toEqual('original-application-your-name');
					expect(result.errors[0].value).toEqual('');
				}
			},
			{
				title: 'The planning application was made in my name',
				given: () => ({
					body: {
						'original-application-your-name': 'yes'
					}
				}),
				expected: (result) => {
					expect(result.errors).toHaveLength(0);
				}
			},
			{
				title: 'The planning application was not made in my name',
				given: () => ({
					body: {
						'original-application-your-name': 'no'
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
});
