const {
  combinedDecisionDateFieldValidator,
  decisionDateExpiredMessage,
  decisionDateCombiner,
  rules,
} = require('../../../../src/validators/eligibility/decision-date');

describe('validators/eligibility/decision-date', () => {
  describe('rules', () => {
    it(`has a rule for the decision date day`, () => {
      const rule = rules()[0].builder.build();

      expect(rule.fields).toEqual(['decision-date-day']);
      expect(rule.locations).toEqual(['body']);
      expect(rule.optional).toBeFalsy();
      expect(rule.stack[0].validator.name).toEqual('isEmpty');
      expect(rule.stack[0].negated).toBeTruthy();
    });

    it(`has a rule for the decision date month`, () => {
      const rule = rules()[1].builder.build();

      expect(rule.fields).toEqual(['decision-date-month']);
      expect(rule.locations).toEqual(['body']);
      expect(rule.optional).toBeFalsy();
      expect(rule.stack[0].validator.name).toEqual('isEmpty');
      expect(rule.stack[0].negated).toBeTruthy();
    });

    it(`has a rule for the decision date year`, () => {
      const rule = rules()[2].builder.build();

      expect(rule.fields).toEqual(['decision-date-year']);
      expect(rule.locations).toEqual(['body']);
      expect(rule.optional).toBeFalsy();
      expect(rule.stack[0].validator.name).toEqual('isEmpty');
      expect(rule.stack[0].negated).toBeTruthy();
    });

    it(`has a rule for the decision date as a combined field`, () => {
      const rule = rules()[3].builder.build();

      expect(rule.fields).toEqual(['decision-date']);
      expect(rule.locations).toEqual(['body']);
      expect(rule.optional).toBeFalsy();
      // bit of a rubbish test
      expect(rule.stack.length).toEqual(1);
    });

    it('should have an array of rules', () => {
      expect(rules().length).toEqual(4);
      expect(rules()[0].builder.fields[0]).toEqual('decision-date-day');
      expect(rules()[1].builder.fields[0]).toEqual('decision-date-month');
      expect(rules()[2].builder.fields[0]).toEqual('decision-date-year');
      expect(rules()[3].builder.fields[0]).toEqual('decision-date');
    });
  });

  describe('decisionDateExpiredMessage', () => {
    it('should be defined', () => {
      expect(decisionDateExpiredMessage).toEqual('Decision date expired');
    });
  });

  describe('decisionDateCombiner', () => {
    it('should combine the date from the given request object', () => {
      const req = {
        body: {
          'decision-date-day': 11,
          'decision-date-month': 3,
          'decision-date-year': 2020,
        },
      };
      expect(decisionDateCombiner(req)).toEqual('2020-3-11');
      expect(req.body['decision-date-full']).toEqual('2020-3-11');
    });
  });

  describe('combinedDecisionDateFieldValidator', () => {
    it('should throw if given an invalid date', () => {
      expect(() => combinedDecisionDateFieldValidator({})).toThrowError(
        new Error('You need to provide a date')
      );
    });

    it('should throw if given an invalid date - unusual format', () => {
      const req = {
        body: {
          'decision-date-day': 1111,
          'decision-date-month': 3333,
          'decision-date-year': 2020909,
        },
      };
      expect(() => combinedDecisionDateFieldValidator(req)).toThrowError(
        new Error('You need to provide a date')
      );
    });

    it('should throw if decision date is too far in the future', () => {
      const req = {
        body: {
          'decision-date-day': 11,
          'decision-date-month': 6,
          'decision-date-year': 2130,
        },
      };
      expect(() => combinedDecisionDateFieldValidator(req)).toThrowError(
        new Error('You need to provide a date')
      );
    });

    it('should resolve if valid', async () => {
      const now = new Date();
      const req = {
        body: {
          'decision-date-day': now.getDate(),
          'decision-date-month': now.getMonth() + 1,
          'decision-date-year': now.getFullYear(),
        },
      };
      const outcome = await combinedDecisionDateFieldValidator(req);
      expect(outcome).toEqual(true);
    });
  });
});
