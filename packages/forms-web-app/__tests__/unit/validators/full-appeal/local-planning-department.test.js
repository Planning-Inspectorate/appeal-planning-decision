jest.mock('../../../../src/services/department.service');
const { validationResult } = require('express-validator');
const { rules } = require('../../../../src/validators/full-appeal/local-planning-department');
const { testExpressValidatorMiddleware } = require('../validation-middleware-helper');

describe('validators/local-planning-department', () => {
	describe('rules', () => {
		it('is configured with the expected rules', () => {
			const rule = rules()[0].builder.build();

			expect(rules().length).toEqual(2);
			expect(rule.fields).toEqual(['local-planning-department']);
			expect(rule.locations).toEqual(['body']);
			expect(rule.optional).toBeFalsy();
			expect(rule.stack).toHaveLength(2);
			expect(rule.stack[0].message).toEqual('Enter the local planning authority');
		});
	});
	describe('validator', () => {
		[
			{
				title: 'eligible local planning department provided',
				given: () => ({
					body: {
						'local-planning-department': 'lpa1',
						'added-name': 'lpa1'
					}
				}),
				expected: (result) => {
					expect(result.errors).toHaveLength(1);
				}
			},
			{
				title: 'local planning department is not provided',
				given: () => ({
					body: {}
				}),
				expected: (result) => {
					expect(result.errors).toHaveLength(2);
					expect(result.errors[0].location).toEqual('body');
					expect(result.errors[0].msg).toEqual('Enter the local planning authority');
					expect(result.errors[0].param).toEqual('local-planning-department');
					expect(result.errors[1].msg).toEqual('Enter a real local planning authority');
					expect(result.errors[1].param).toEqual('local-planning-department');
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
