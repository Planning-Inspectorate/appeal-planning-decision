const { rules } = require('../../../../src/validators/interested-parties/add-comments');

describe('validators/interested-parties/email-address', () => {
	describe('rules', () => {
		it(`has a rule for the interested parties comments`, () => {
			const rule = rules()[0].builder.build();
			expect(rule.fields).toEqual(['comments']);
			expect(rule.locations).toEqual(['body']);
			expect(rule.optional).toBeFalsy();
			expect(rule.stack).toHaveLength(3);
			expect(rule.stack[0].message).toEqual('Enter your comments');
			expect(rule.stack[2].validator.name).toEqual('isLength');
		});

		it(`has a rule for the interested parties comment confirmation`, () => {
			const rule = rules()[1].builder.build();
			expect(rule.fields).toEqual(['comments-confirmation']);
			expect(rule.locations).toEqual(['body']);
			expect(rule.optional).toBeFalsy();
			expect(rule.stack).toHaveLength(1);
			expect(rule.stack[0].message).toEqual(
				'Select that you have not included any sensitive information in your comments.'
			);
			expect(rule.stack[0].validator.name).toEqual('isEmpty');
		});

		it('should have an array containing rule', () => {
			expect(rules().length).toEqual(2);
			expect(rules()[0].builder.fields[0]).toEqual('comments');
			expect(rules()[1].builder.fields[0]).toEqual('comments-confirmation');
		});
	});
});
