const { validationResult } = require('express-validator');
const {
	rules
} = require('../../../../src/validators/before-you-start/contact-planning-inspectorate-date');
const { testExpressValidatorMiddleware } = require('../validation-middleware-helper');

describe('validators/before-you-start/contact-planning-inspectorate-date', () => {
	describe('rules', () => {
		it('is configured with the expected rules', () => {
			expect(rules().length).toEqual(7);
		});

		it(`has a rule to check for empty day input`, () => {
			const rule = rules()[0].builder.build();

			expect(rule.fields).toEqual(['contact-planning-inspectorate-date-day']);
			expect(rule.locations).toEqual(['body']);
			expect(rule.optional).toBeFalsy();
			expect(rule.stack[1].validator.name).toEqual('isEmpty');
			expect(rule.stack[1].negated).toBeTruthy();
		});

		it(`has a rule to check for empty month input`, () => {
			const rule = rules()[1].builder.build();

			expect(rule.fields).toEqual(['contact-planning-inspectorate-date-month']);
			expect(rule.locations).toEqual(['body']);
			expect(rule.optional).toBeFalsy();
			expect(rule.stack[1].validator.name).toEqual('isEmpty');
			expect(rule.stack[1].negated).toBeTruthy();
		});

		it(`has a rule for check for empty year input`, () => {
			const rule = rules()[2].builder.build();

			expect(rule.fields).toEqual(['contact-planning-inspectorate-date-year']);
			expect(rule.locations).toEqual(['body']);
			expect(rule.optional).toBeFalsy();
			expect(rule.stack[1].validator.name).toEqual('isEmpty');
			expect(rule.stack[1].negated).toBeTruthy();
		});

		it(`has a rule to check for valid day input`, () => {
			const rule = rules()[3].builder.build();

			expect(rule.fields).toEqual(['contact-planning-inspectorate-date-day']);
			expect(rule.locations).toEqual(['body']);
			expect(rule.optional).toBeFalsy();
			expect(rule.stack[1].options).toEqual([{ min: 1, max: 31 }]);
			expect(rule.stack[1].negated).toBeFalsy();
			expect(rule.stack[4].negated).toBeFalsy();
		});

		it(`has a rule to check for valid month input`, () => {
			const rule = rules()[4].builder.build();

			expect(rule.fields).toEqual(['contact-planning-inspectorate-date-month']);
			expect(rule.locations).toEqual(['body']);
			expect(rule.optional).toBeFalsy();
			expect(rule.stack[0].sanitizer.name).toEqual('trim');
			expect(rule.stack[1].validator.name).toEqual('');
			expect(rule.stack[1].negated).toBeFalsy();
		});

		it(`has a rule for valid year input`, () => {
			const rule = rules()[5].builder.build();

			expect(rule.fields).toEqual(['contact-planning-inspectorate-date-year']);
			expect(rule.locations).toEqual(['body']);
			expect(rule.optional).toBeFalsy();
			expect(rule.stack[1].options).toEqual([{ min: 1000, max: 9999 }]);
			expect(rule.stack[1].negated).toBeFalsy();
		});

		it(`has a rule for ensuring date is not in the future`, () => {
			const rule = rules()[6].builder.build();

			expect(rule.fields).toEqual(['contact-planning-inspectorate-date-day']);
			expect(rule.locations).toEqual(['body']);
			expect(rule.optional).toBeFalsy();
			expect(rule.stack[0].sanitizer.name).toEqual('trim');
			expect(rule.stack[1].validator.name).toEqual('');
			expect(rule.stack[1].negated).toBeFalsy();
		});
	});

	describe('validator', () => {
		[
			{
				title: 'invalid (all empty) - fail',
				given: () => ({
					body: {
						'contact-planning-inspectorate-date-day': '',
						'contact-planning-inspectorate-date-month': '',
						'contact-planning-inspectorate-date-year': ''
					}
				}),
				expected: (result) => {
					expect(result.errors[0].location).toEqual('body');
					expect(result.errors[0].msg).toEqual(
						'Enter the date you contacted the Planning Inspectorate'
					);
					expect(result.errors[0].path).toEqual('contact-planning-inspectorate-date-day');
					expect(result.errors[0].value).toEqual('');
				}
			},
			{
				title: 'invalid (empty day, month) - fail',
				given: () => ({
					body: {
						'contact-planning-inspectorate-date-day': '',
						'contact-planning-inspectorate-date-month': '',
						'contact-planning-inspectorate-date-year': '2020'
					}
				}),
				expected: (result) => {
					expect(result.errors[0].location).toEqual('body');
					expect(result.errors[0].msg).toEqual(
						'The date you contacted the Planning Inspectorate must include a day and month'
					);
					expect(result.errors[0].path).toEqual('contact-planning-inspectorate-date-day');
					expect(result.errors[0].value).toEqual('');
				}
			},
			{
				title: 'invalid (empty day, year) - fail',
				given: () => ({
					body: {
						'contact-planning-inspectorate-date-day': '',
						'contact-planning-inspectorate-date-month': '12',
						'contact-planning-inspectorate-date-year': ''
					}
				}),
				expected: (result) => {
					expect(result.errors[0].location).toEqual('body');
					expect(result.errors[0].msg).toEqual(
						'The date you contacted the Planning Inspectorate must include a day and year'
					);
					expect(result.errors[0].path).toEqual('contact-planning-inspectorate-date-day');
					expect(result.errors[0].value).toEqual('');
				}
			},
			{
				title: 'invalid (empty day) - fail',
				given: () => ({
					body: {
						'contact-planning-inspectorate-date-day': '',
						'contact-planning-inspectorate-date-month': '12',
						'contact-planning-inspectorate-date-year': '2020'
					}
				}),
				expected: (result) => {
					expect(result.errors[0].location).toEqual('body');
					expect(result.errors[0].msg).toEqual(
						'The date you contacted the Planning Inspectorate must include a day'
					);
					expect(result.errors[0].path).toEqual('contact-planning-inspectorate-date-day');
					expect(result.errors[0].value).toEqual('');
				}
			},
			{
				title: 'invalid (empty month, year) - fail',
				given: () => ({
					body: {
						'contact-planning-inspectorate-date-day': '1',
						'contact-planning-inspectorate-date-month': '',
						'contact-planning-inspectorate-date-year': ''
					}
				}),
				expected: (result) => {
					expect(result.errors[0].location).toEqual('body');
					expect(result.errors[0].msg).toEqual(
						'The date you contacted the Planning Inspectorate must include a month and year'
					);
					expect(result.errors[0].path).toEqual('contact-planning-inspectorate-date-month');
					expect(result.errors[0].value).toEqual('');
				}
			},
			{
				title: 'invalid (empty month) - fail',
				given: () => ({
					body: {
						'contact-planning-inspectorate-date-day': '1',
						'contact-planning-inspectorate-date-month': '',
						'contact-planning-inspectorate-date-year': '2020'
					}
				}),
				expected: (result) => {
					expect(result.errors[0].location).toEqual('body');
					expect(result.errors[0].msg).toEqual(
						'The date you contacted the Planning Inspectorate must include a month'
					);
					expect(result.errors[0].path).toEqual('contact-planning-inspectorate-date-month');
					expect(result.errors[0].value).toEqual('');
				}
			},
			{
				title: 'invalid (empty year) - fail',
				given: () => ({
					body: {
						'contact-planning-inspectorate-date-day': '1',
						'contact-planning-inspectorate-date-month': '12',
						'contact-planning-inspectorate-date-year': ''
					}
				}),
				expected: (result) => {
					expect(result.errors[0].location).toEqual('body');
					expect(result.errors[0].msg).toEqual(
						'The date you contacted the Planning Inspectorate must include a year'
					);
					expect(result.errors[0].path).toEqual('contact-planning-inspectorate-date-year');
					expect(result.errors[0].value).toEqual('');
				}
			},
			{
				title: 'invalid (day not integer) - fail',
				given: () => ({
					body: {
						'contact-planning-inspectorate-date-day': 'mock',
						'contact-planning-inspectorate-date-month': '12',
						'contact-planning-inspectorate-date-year': '2020'
					}
				}),
				expected: (result) => {
					expect(result.errors[0].location).toEqual('body');
					expect(result.errors[0].msg).toEqual(
						'The date you contacted the Planning Inspectorate must be a real date'
					);
					expect(result.errors[0].path).toEqual('contact-planning-inspectorate-date-day');
					expect(result.errors[0].value).toEqual('mock');
				}
			},
			{
				title: 'invalid (day > 31) - fail',
				given: () => ({
					body: {
						'contact-planning-inspectorate-date-day': '45',
						'contact-planning-inspectorate-date-month': '12',
						'contact-planning-inspectorate-date-year': '2020'
					}
				}),
				expected: (result) => {
					expect(result.errors[0].location).toEqual('body');
					expect(result.errors[0].msg).toEqual(
						'The date you contacted the Planning Inspectorate must be a real date'
					);
					expect(result.errors[0].path).toEqual('contact-planning-inspectorate-date-day');
					expect(result.errors[0].value).toEqual('45');
				}
			},
			{
				title: 'invalid (31 day in 30 day month) - fail',
				given: () => ({
					body: {
						'contact-planning-inspectorate-date-day': '31',
						'contact-planning-inspectorate-date-month': '6',
						'contact-planning-inspectorate-date-year': '2020'
					}
				}),
				expected: (result) => {
					expect(result.errors[0].location).toEqual('body');
					expect(result.errors[0].msg).toEqual(
						'The date you contacted the Planning Inspectorate must be a real date'
					);
					expect(result.errors[0].path).toEqual('contact-planning-inspectorate-date-day');
					expect(result.errors[0].value).toEqual(31);
				}
			},
			{
				title: 'invalid (29 days in February when not leap year) - fail',
				given: () => ({
					body: {
						'contact-planning-inspectorate-date-day': '29',
						'contact-planning-inspectorate-date-month': '2',
						'contact-planning-inspectorate-date-year': '2019'
					}
				}),
				expected: (result) => {
					expect(result.errors[0].location).toEqual('body');
					expect(result.errors[0].msg).toEqual(
						'The date you contacted the Planning Inspectorate must be a real date'
					);
					expect(result.errors[0].path).toEqual('contact-planning-inspectorate-date-day');
					expect(result.errors[0].value).toEqual(29);
				}
			},
			{
				title: 'invalid (month not numeric) - fail',
				given: () => ({
					body: {
						'contact-planning-inspectorate-date-day': '1',
						'contact-planning-inspectorate-date-month': 'mock',
						'contact-planning-inspectorate-date-year': '2020'
					}
				}),
				expected: (result) => {
					expect(result.errors[0].location).toEqual('body');
					expect(result.errors[0].msg).toEqual(
						'The date you contacted the Planning Inspectorate must be a real date'
					);
					expect(result.errors[0].path).toEqual('contact-planning-inspectorate-date-month');
					expect(result.errors[0].value).toEqual('mock');
				}
			},
			{
				title: 'invalid (impossible number months) - fail',
				given: () => ({
					body: {
						'contact-planning-inspectorate-date-day': '1',
						'contact-planning-inspectorate-date-month': '22',
						'contact-planning-inspectorate-date-year': '2020'
					}
				}),
				expected: (result) => {
					expect(result.errors[0].location).toEqual('body');
					expect(result.errors[0].msg).toEqual(
						'The date you contacted the Planning Inspectorate must be a real date'
					);
					expect(result.errors[0].path).toEqual('contact-planning-inspectorate-date-month');
					expect(result.errors[0].value).toEqual('22');
				}
			},
			{
				title: 'invalid (year not numeric) - fail',
				given: () => ({
					body: {
						'contact-planning-inspectorate-date-day': '1',
						'contact-planning-inspectorate-date-month': '12',
						'contact-planning-inspectorate-date-year': 'mock'
					}
				}),
				expected: (result) => {
					expect(result.errors[0].location).toEqual('body');
					expect(result.errors[0].msg).toEqual(
						'The date you contacted the Planning Inspectorate must be a real date'
					);
					expect(result.errors[0].path).toEqual('contact-planning-inspectorate-date-year');
					expect(result.errors[0].value).toEqual('mock');
				}
			},
			{
				title: 'invalid (year outside range) - fail',
				given: () => ({
					body: {
						'contact-planning-inspectorate-date-day': '1',
						'contact-planning-inspectorate-date-month': '12',
						'contact-planning-inspectorate-date-year': '10'
					}
				}),
				expected: (result) => {
					expect(result.errors[0].location).toEqual('body');
					expect(result.errors[0].msg).toEqual(
						'The date you contacted the Planning Inspectorate must be a real date'
					);
					expect(result.errors[0].path).toEqual('contact-planning-inspectorate-date-year');
					expect(result.errors[0].value).toEqual('10');
				}
			},
			{
				title: 'valid date (29 days in leap year) - pass',
				given: () => ({
					body: {
						'contact-planning-inspectorate-date-day': '29',
						'contact-planning-inspectorate-date-month': '2',
						'contact-planning-inspectorate-date-year': '2020'
					}
				}),
				expected: (result) => {
					expect(result.errors).toHaveLength(0);
				}
			},
			{
				title: 'valid date - pass',
				given: () => {
					return {
						body: {
							'contact-planning-inspectorate-date-day': '1',
							'contact-planning-inspectorate-date-month': '12',
							'contact-planning-inspectorate-date-year': '2020'
						}
					};
				},
				expected: (result) => {
					expect(result.errors).toHaveLength(0);
				}
			},
			{
				title: 'invalid (date in future) - fail',
				given: () => ({
					body: {
						'contact-planning-inspectorate-date-day': '1',
						'contact-planning-inspectorate-date-month': '12',
						'contact-planning-inspectorate-date-year': '3000'
					}
				}),
				expected: (result) => {
					expect(result.errors[0].location).toEqual('body');
					expect(result.errors[0].msg).toEqual(
						'The date you contacted the Planning Inspectorate must be today or in the past'
					);
					expect(result.errors[0].path).toEqual('contact-planning-inspectorate-date-day');
					expect(result.errors[0].value).toEqual('1');
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
