const cookies = require('../../src/routes/cookies');

const index = require('../../src/routes/index');

describe('routes/index', () => {
  it('should export the expected shape', () => {
    expect(index).toEqual({
      cookies,
    });
  });
});
