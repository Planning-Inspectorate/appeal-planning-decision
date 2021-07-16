const index = require('./index');
const deadlineDate = require('./deadline-date');

describe('business-rules/appeal', () => {
  it('should export the expected shape', () => {
    expect(index).toEqual({
      deadlineDate,
    });
  });
});
