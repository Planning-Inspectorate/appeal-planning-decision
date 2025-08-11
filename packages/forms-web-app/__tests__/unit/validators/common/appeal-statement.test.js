const { validationResult } = require('express-validator');
const { testExpressValidatorMiddleware } = require('../validation-middleware-helper');
const { rules } = require('../../../../src/validators/common/appeal-statement');
const config = require('../../../../src/config');

jest.mock('@pins/common/src/client/clamav-client');

describe('validators/common/appeal-statement', () => {
	const sessionWithAppealSubmitted = {
		appeal: { yourAppealSection: { appealStatement: { uploadedFile: { id: 'appeal.pdf' } } } }
	};
	const files = {
		'file-upload': {
			mimetype: config.fileUpload.pins.allowedFileTypes.MIME_TYPE_JPEG,
			size: config.fileUpload.maxFileSizeBytes - 1
		}
	};

	describe('rules', () => {
		it('has a rule for `does-not-include-sensitive-information`', () => {
			const rule = rules()[1].builder.build();

			expect(rule.fields).toEqual(['does-not-include-sensitive-information']);
			expect(rule.locations).toEqual(['body']);
			expect(rule.optional).toBeFalsy();
			expect(rule.stack).toHaveLength(3);
			expect(rule.stack[0].message).toEqual(
				'Select to confirm that you have not included any sensitive information in your appeal statement'
			);
			expect(rule.stack[2].validator.name).toEqual('equals');
			expect(rule.stack[2].options).toEqual(['i-confirm']);
		});

		it('has a rule for `file-upload`', () => {
			const rule = rules()[0][0].builder.build();

			expect(rule.fields).toEqual(['file-upload']);
			expect(rule.optional).toBeFalsy();
			expect(rule.stack).toHaveLength(1);
			expect(rule.stack[0].validator.name).toEqual('options');
			expect(rule.stack[0].validator.negated).toBeFalsy();
		});

		it('should have the expected number of configured rules', () => {
			expect(rules().length).toEqual(2);
		});
	});

	describe('validator', () => {
		[
			{
				title: 'no value for `does-not-include-sensitive-information` - fail',
				given: () => ({
					session: sessionWithAppealSubmitted,
					body: {},
					files
				}),
				expected: (result) => {
					expect(result.errors).toHaveLength(1);
					expect(result.errors[0].location).toEqual('body');
					expect(result.errors[0].msg).toEqual(
						'Select to confirm that you have not included any sensitive information in your appeal statement'
					);
					expect(result.errors[0].path).toEqual('does-not-include-sensitive-information');
					expect(result.errors[0].value).toEqual(undefined);
				}
			},
			{
				title: 'invalid value for `does-not-include-sensitive-information` - fail',
				given: () => ({
					session: sessionWithAppealSubmitted,
					body: {
						'does-not-include-sensitive-information': 12
					},
					files
				}),
				expected: (result) => {
					expect(result.errors).toHaveLength(1);
					expect(result.errors[0].location).toEqual('body');
					expect(result.errors[0].msg).toEqual('Invalid value');
					expect(result.errors[0].path).toEqual('does-not-include-sensitive-information');
					expect(result.errors[0].value).toEqual(12);
				}
			},
			{
				title: 'valid value for `does-not-include-sensitive-information` - "i-confirm" - pass',
				given: () => ({
					session: sessionWithAppealSubmitted,
					body: {
						'does-not-include-sensitive-information': 'i-confirm'
					},
					files
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
