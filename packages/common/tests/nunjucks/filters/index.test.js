const index = require('../../../src/nunjucks/filters');

const renderTemplate = require('../../../src/nunjucks/filters/render-template-filter');

describe('nunjucks/filters/index', () => {
  it('should export the expected shape', () => {
    expect(index).toEqual({
      renderTemplate,
    });
  });
});
