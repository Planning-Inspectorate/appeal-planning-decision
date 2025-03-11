const { rules } = require('../../../../src/validators/interested-parties/email-address');

describe('validators/interested-parties/email-address', () => {
	describe('rules', () => {
		it(`has a rule for the interested parties email`, () => {
			const rule = rules()[0].builder.build();
			expect(rule.fields).toEqual(['email-address']);
			expect(rule.locations).toEqual(['body']);
			expect(rule.optional).toBeFalsy();
			expect(rule.stack).toHaveLength(8);
			expect(rule.stack[0].message).toEqual('Enter your email address');
			expect(rule.stack[3].validator.name).toEqual('isEmail');
		});

		it('should have an array containing rule', () => {
			expect(rules().length).toEqual(1);
			expect(rules()[0].builder.fields[0]).toEqual('email-address');
		});
	});
});
