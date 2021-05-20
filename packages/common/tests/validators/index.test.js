const cookies = require('../../src/validators/cookies');
const validationErrorHandler = require('../../src/validators/validation-error-handler');

const index = require('../../src/validators/index');

describe('validators/index', () => {
  it('should export the expected shape', () => {
    expect(index).toEqual({
      cookies,
      validationErrorHandler,
    });
  });
});
