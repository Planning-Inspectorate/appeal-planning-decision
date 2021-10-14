const index = require('./index');
const rules = require('./rules');
const validation = require('./validation');
const schemas = require('./schemas');

describe('index', () => {
  it('should export the expected data shape', () => {
    expect(index).toEqual({
      rules,
      validation,
      schemas,
    });
  });
});
