const index = require('./index');
const dueDate = require('./due-date');

describe('business-rules/questionnaire', () => {
  it('should export the expected shape', () => {
    expect(index).toEqual({
      dueDate,
    });
  });
});
