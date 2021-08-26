const index = require('./index');
const appeal = require('./appeal');
const questionnaire = require('./questionnaire');

describe('index', () => {
  it('should export the expected data shape', () => {
    expect(index).toEqual({
      appeal,
      questionnaire,
    });
  });
});
