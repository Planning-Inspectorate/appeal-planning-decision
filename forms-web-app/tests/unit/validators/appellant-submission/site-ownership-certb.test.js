jest.mock('../../../../src/services/department.service');
const { rules } = require('../../../../src/validators/appellant-submission/site-ownership-certb');

describe('validators/appellant-submission/site-ownership-certb', () => {
  describe('rules', () => {
    it('is configured with the expected rules', () => {
      expect(rules().length).toEqual(1);
    });

    describe('ruleSiteOwnershipCertB', () => {
      it('is configured with the expected rules', () => {
        const rule = rules()[0].builder.build();

        expect(rule.fields).toEqual(['have-other-owners-been-told']);
        expect(rule.locations).toEqual(['body']);
        expect(rule.optional).toBeFalsy();
        expect(rule.stack).toHaveLength(3);

        expect(rule.stack[0].negated).toBeTruthy();
        expect(rule.stack[0].validator.name).toEqual('isEmpty');
        expect(rule.stack[0].message).toEqual('Select yes if you have told the other owners');

        expect(rule.stack[2].negated).toBeFalsy();
        expect(rule.stack[2].validator.name).toEqual('isIn');
        expect(rule.stack[2].options).toEqual([['yes', 'no']]);
      });
    });
  });
});
