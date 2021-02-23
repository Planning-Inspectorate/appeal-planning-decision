const cookies = require('../../../src/lib/cookies');

describe('lib/cookies', () => {
  test('DEFAULT_COOKIE_POLICY', () => {
    expect(cookies.DEFAULT_COOKIE_POLICY).toEqual({
      essential: true,
      settings: false,
      usage: false,
      campaigns: false,
    });
  });
});
