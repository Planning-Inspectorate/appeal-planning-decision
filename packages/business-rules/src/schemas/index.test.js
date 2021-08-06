const index = require('./index');
const validate = require('./validate');

describe('index', () => {
  it('should export the expected data shape', () => {
    expect(index).toEqual({
      validate,
    });
  });
});
