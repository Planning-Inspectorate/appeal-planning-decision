const { validationResult } = require('express-validator');
const { testExpressValidatorMiddleware } = require('../validation-middleware-helper');
const { rules } = require('../../../../src/validators/full-appeal/applicant-name');

describe('validators/contact-details', () => {
	describe('rules', () => {
		it(`has a rule for the applicant's name`, () => {
			const rule = rules()[0].builder.build();

			expect(rule.fields).toEqual(['behalf-appellant-name']);
			expect(rule.locations).toEqual(['body']);
			expect(rule.optional).toBeFalsy();
			expect(rule.stack).toHaveLength(3);

			expect(rule.stack[0].validator.name).toEqual('isEmpty');
			expect(rule.stack[0].negated).toBeTruthy();
			expect(rule.stack[0].message).toEqual('Enter the Applicant’s name');

			expect(rule.stack[2].validator.name).toEqual('isLength');
			expect(rule.stack[2].options).toEqual([{ min: 2, max: 80 }]);
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
					expect(result.errors[0].msg).toEqual('Enter the Applicant’s name');
					expect(result.errors[0].param).toEqual('behalf-appellant-name');
					expect(result.errors[0].value).toEqual(undefined);
				}
			},
			{
				title: 'invalid values 2 - fail - name too short',
				given: () => ({
					body: {
						'behalf-appellant-name': 'a'
					}
				}),
				expected: (result) => {
					expect(result.errors).toHaveLength(1);
					expect(result.errors[0].location).toEqual('body');
					expect(result.errors[0].msg).toEqual('Name must be between 2 and 80 characters');
					expect(result.errors[0].param).toEqual('behalf-appellant-name');
					expect(result.errors[0].value).toEqual('a');
				}
			},
			{
				title: 'invalid values 2 - fail - name too long',
				given: () => ({
					body: {
						'behalf-appellant-name':
							'Invalid name because it is eighty-one characters long--abcdefghijklmnopqrstuvwxyz'
					}
				}),
				expected: (result) => {
					expect(result.errors).toHaveLength(1);
					expect(result.errors[0].location).toEqual('body');
					expect(result.errors[0].msg).toEqual('Name must be between 2 and 80 characters');
					expect(result.errors[0].param).toEqual('behalf-appellant-name');
					expect(result.errors[0].value).toEqual(
						'Invalid name because it is eighty-one characters long--abcdefghijklmnopqrstuvwxyz'
					);
				}
			},
			{
				title: 'valid values - pass',
				given: () => ({
					body: {
						'behalf-appellant-name': "timmy o'tester-jones"
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
