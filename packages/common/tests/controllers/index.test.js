const index = require('../../src/controllers/index');

const cookies = require('../../src/controllers/cookies');

describe('controllers/index', () => {
  it('should export the expected shape', () => {
    expect(index).toEqual({
      cookies,
    });
  });
});
