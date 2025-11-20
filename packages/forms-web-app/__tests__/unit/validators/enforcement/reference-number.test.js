const { validationResult } = require('express-validator');
const { rules } = require('../../../../src/validators/enforcement/reference-number');
const { testExpressValidatorMiddleware } = require('../validation-middleware-helper');

describe('validators/enforcement/reference-number', () => {
	describe('rules', () => {
		it('is configured with the expected rules', () => {
			const rule = rules()[0].builder.build();

			expect(rules().length).toEqual(1);
			expect(rule.fields).toEqual(['reference-number']);
			expect(rule.locations).toEqual(['body']);
			expect(rule.optional).toBeFalsy();
			expect(rule.stack).toHaveLength(3);

			expect(rule.stack[0].negated).toBeTruthy();
			expect(rule.stack[0].validator.name).toEqual('isEmpty');
			expect(rule.stack[0].message).toEqual('Enter the reference number on the enforcement notice');

			expect(rule.stack[2].validator.name).toEqual('isLength');
			expect(rule.stack[2].options).toEqual([{ min: 1, max: 250 }]);
			expect(rule.stack[2].message).toEqual('Reference number must be 250 characters or less');
		});
	});
	describe('validator', () => {
		[
			{
				title: 'valid enforcement reference number provided',
				given: () => ({
					body: {
						'reference-number': 'valid entry here'
					}
				}),
				expected: (result) => {
					expect(result.errors).toHaveLength(0);
				}
			},
			{
				title: 'enforcement reference number not provided',
				given: () => ({
					body: {}
				}),
				expected: (result) => {
					expect(result.errors).toHaveLength(1);
					expect(result.errors[0].msg).toEqual(
						'Enter the reference number on the enforcement notice'
					);
				}
			},
			{
				title: 'enforcement reference number provided but empty',
				given: () => ({
					body: {
						'reference-number': ''
					}
				}),
				expected: (result) => {
					expect(result.errors).toHaveLength(1);
					expect(result.errors[0].msg).toEqual(
						'Enter the reference number on the enforcement notice'
					);
				}
			},
			{
				title: 'enforcement reference number provided but exceeds 250 characters',
				given: () => ({
					body: {
						'reference-number':
							'12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901'
					}
				}),
				expected: (result) => {
					expect(result.errors).toHaveLength(1);
					expect(result.errors[0].msg).toEqual('Reference number must be 250 characters or less');
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
