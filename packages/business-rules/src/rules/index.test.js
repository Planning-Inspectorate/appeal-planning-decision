const index = require('./index');
const appeal = require('./appeal');

describe('index', () => {
  it('should export the expected data shape', () => {
    expect(index).toEqual({
      appeal
    });
  });
});
