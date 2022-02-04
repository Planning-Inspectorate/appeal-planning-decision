const index = require('./index');
const decisionDate = require('./decision-date');
const conditionalText = require('../common/conditional-text');

describe('validators/appeal/index', () => {
  it('should export the expected shape', () => {
    expect(index).toEqual({
      decisionDate,
      conditionalText,
    });
  });
});
