const index = require('./index');
const decisionDate = require('./decision-date');

describe('validators/appeal/index', () => {
  it('should export the expected shape', () => {
    expect(index).toEqual({
      decisionDate,
    });
  });
});
