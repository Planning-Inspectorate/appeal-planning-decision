const cleanUpSession = require('../../../src/lib/clean-up-session');

describe('lib/clean-up-session', () => {
  [
    {
      description: 'no req.session object',
      given: {},
      expected: {},
    },
    {
      description: 'req.session is only key',
      given: {
        session: {},
      },
      expected: {},
    },
    {
      description: 'other keys are not impacted',
      given: {
        session: {
          hello: 'world',
        },
        a: 'b',
        c: 'd',
      },
      expected: {
        a: 'b',
        c: 'd',
      },
    },
  ].forEach(({ description, given, expected }) => {
    test(description, () => {
      expect(cleanUpSession(given)).toEqual(expected);
    });
  });
});
