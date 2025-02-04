const { validationResult } = require('express-validator');
const { rules } = require('../../../../src/validators/full-appeal/listed-building');
const { testExpressValidatorMiddleware } = require('../validation-middleware-helper');

describe('validators/planning-department', () => {
	describe('rules', () => {
		it('is configured with the expected rules', () => {
			const rule = rules()[0].builder.build();

			expect(rules().length).toEqual(1);
			expect(rule.fields).toEqual(['listed-building']);
			expect(rule.locations).toEqual(['body']);
			expect(rule.optional).toBeFalsy();
			expect(rule.stack).toHaveLength(2);
			expect(rule.stack[0].message).toEqual('Select yes if your appeal is about a listed building');
		});
	});
	describe('validator', () => {
		[
			{
				title: 'no error yes',
				given: () => ({
					body: {
						'listed-building': 'yes'
					}
				}),
				expected: (result) => {
					expect(result.errors).toHaveLength(0);
				}
			},
			{
				title: 'no error no',
				given: () => ({
					body: {
						'listed-building': 'no'
					}
				}),
				expected: (result) => {
					expect(result.errors).toHaveLength(0);
				}
			},
			{
				title: 'error',
				given: () => ({
					body: {
						'listed-building': ''
					}
				}),
				expected: (result) => {
					expect(result.errors).toHaveLength(1);
					expect(result.errors[0].location).toEqual('body');
					expect(result.errors[0].msg).toEqual(
						'Select yes if your appeal is about a listed building'
					);
					expect(result.errors[0].param).toEqual('listed-building');
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
