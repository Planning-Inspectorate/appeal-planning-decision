const index = require('../src');

const rules = require('../src/rules');
const validation = require('../src/validation');

describe('index', () => {
  it(`should export the expected data shape`, () => {
    expect(index).toEqual({
      rules,
      validation,
    });
  });
});
