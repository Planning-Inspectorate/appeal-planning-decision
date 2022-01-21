const index = require('./index');
const deadlineDate = require('./deadline-date');
const deadlinePeriod = require('./deadline-period');

describe('business-rules/appeal', () => {
  it('should export the expected shape', () => {
    expect(index).toEqual({
      deadlineDate,
      deadlinePeriod,
    });
  });
});
