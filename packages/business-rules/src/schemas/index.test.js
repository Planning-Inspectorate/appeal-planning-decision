const index = require('./index');
const { businessRules } = require('./business-rules');

describe('index', () => {
  it('should export the expected data shape', () => {
    expect(index).toEqual({
      businessRules,
    });
  });
});
