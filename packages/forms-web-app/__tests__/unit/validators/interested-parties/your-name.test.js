const { rules } = require('../../../../src/validators/interested-parties/your-name');

describe('validators/interested-parties/your-name', () => {
	describe('rules', () => {
		describe('first-name', () => {
			it('is configured with the expected rules', () => {
				const rule = rules()[0].builder.build();

				expect(rule.fields).toEqual(['first-name']);
				expect(rule.locations).toEqual(['body']);
				expect(rule.optional).toBeFalsy();
				expect(rule.stack).toHaveLength(3);

				expect(rule.stack[0].validator.name).toEqual('isEmpty');
				expect(rule.stack[0].negated).toBe(true);
				expect(rule.stack[0].message).toEqual('Enter your first name');

				expect(rule.stack[2].validator.name).toEqual('isLength');
				expect(rule.stack[2].options).toEqual([{ min: 1, max: 250 }]);
			});
		});

		describe('last-name', () => {
			it('is configured with the expected rules', () => {
				const rule = rules()[1].builder.build();

				expect(rule.fields).toEqual(['last-name']);
				expect(rule.locations).toEqual(['body']);
				expect(rule.optional).toBeFalsy();
				expect(rule.stack).toHaveLength(3);

				expect(rule.stack[0].validator.name).toEqual('isEmpty');
				expect(rule.stack[0].negated).toBe(true);
				expect(rule.stack[0].message).toEqual('Enter your last name');

				expect(rule.stack[2].validator.name).toEqual('isLength');
				expect(rule.stack[2].options).toEqual([{ min: 1, max: 250 }]);
			});
		});

		it('should have an array containing rule', () => {
			expect(rules().length).toEqual(2);
			expect(rules()[0].builder.fields[0]).toEqual('first-name');
			expect(rules()[1].builder.fields[0]).toEqual('last-name');
		});
	});
});
