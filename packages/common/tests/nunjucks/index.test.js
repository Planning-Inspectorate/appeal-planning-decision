const filters = require('../../src/nunjucks/filters');

const index = require('../../src/nunjucks/index');

describe('nunjucks/index', () => {
  it('should export the expected shape', () => {
    expect(index).toEqual({
      filters,
    });
  });
});
