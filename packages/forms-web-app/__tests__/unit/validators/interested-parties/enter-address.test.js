const { rules } = require('../../../../src/validators/interested-parties/enter-address');

describe('validators/interested-parties/enter-address', () => {
	describe('rules', () => {
		describe('ruleAddressLine1', () => {
			it('is configured with the expected rules', () => {
				const rule = rules()[0].builder.build();

				expect(rule.fields).toEqual(['addressLine1']);
				expect(rule.locations).toEqual(['body']);
				expect(rule.optional).toBeFalsy();
				expect(rule.stack).toHaveLength(1);

				expect(rule.stack[0].negated).toEqual(false);
				expect(rule.stack[0].validator.name).toEqual('isLength');
				expect(rule.stack[0].options).toEqual([{ max: 255 }]);
				expect(rule.stack[0].message).toEqual('Address line 1 must be 255 characters or less');
			});
		});

		describe('ruleAddressLine2', () => {
			it('is configured with the expected rules', () => {
				const rule = rules()[1].builder.build();

				expect(rule.fields).toEqual(['addressLine2']);
				expect(rule.locations).toEqual(['body']);
				expect(rule.optional).toBeFalsy();
				expect(rule.stack).toHaveLength(1);

				expect(rule.stack[0].negated).toEqual(false);
				expect(rule.stack[0].validator.name).toEqual('isLength');
				expect(rule.stack[0].options).toEqual([{ max: 96 }]);
				expect(rule.stack[0].message).toEqual('Address line 2 must be 96 characters or less');
			});
		});

		describe('ruleAddressTownCity', () => {
			it('is configured with the expected rules', () => {
				const rule = rules()[2].builder.build();

				expect(rule.fields).toEqual(['townCity']);
				expect(rule.locations).toEqual(['body']);
				expect(rule.optional).toBeFalsy();
				expect(rule.stack).toHaveLength(1);

				expect(rule.stack[0].negated).toEqual(false);
				expect(rule.stack[0].validator.name).toEqual('isLength');
				expect(rule.stack[0].options).toEqual([{ max: 64 }]);
				expect(rule.stack[0].message).toEqual('Town or city must be 64 characters or less');
			});
		});

		describe('ruleAddressCounty', () => {
			it('is configured with the expected rules', () => {
				const rule = rules()[3].builder.build();

				expect(rule.fields).toEqual(['county']);
				expect(rule.locations).toEqual(['body']);
				expect(rule.optional).toBeFalsy();
				expect(rule.stack).toHaveLength(1);

				expect(rule.stack[0].negated).toEqual(false);
				expect(rule.stack[0].validator.name).toEqual('isLength');
				expect(rule.stack[0].options).toEqual([{ max: 64 }]);
				expect(rule.stack[0].message).toEqual('County must be 64 characters or less');
			});
		});

		describe('ruleAddressPostCode', () => {
			it('is configured with the expected rules', () => {
				const rule = rules()[4].builder.build();

				expect(rule.fields).toEqual(['postcode']);
				expect(rule.locations).toEqual(['body']);
				expect(rule.optional).toBeFalsy();
				expect(rule.stack).toHaveLength(1);

				expect(rule.stack[0].negated).toEqual(false);
				expect(rule.stack[0].validator.name).toEqual('isLength');
				expect(rule.stack[0].options).toEqual([{ max: 16 }]);
				expect(rule.stack[0].message).toEqual('Postcode must be 16 characters or less');
			});
		});

		it('should have an array containing rule', () => {
			expect(rules().length).toEqual(5);
			expect(rules()[0].builder.fields[0]).toEqual('addressLine1');
			expect(rules()[1].builder.fields[0]).toEqual('addressLine2');
			expect(rules()[2].builder.fields[0]).toEqual('townCity');
			expect(rules()[3].builder.fields[0]).toEqual('county');
			expect(rules()[4].builder.fields[0]).toEqual('postcode');
		});
	});
});
