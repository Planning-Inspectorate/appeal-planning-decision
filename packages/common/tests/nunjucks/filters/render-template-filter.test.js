const renderTemplateFilter = require('../../../src/nunjucks/filters/render-template-filter');

describe('nunjucks/filters/render-template-filter', () => {
  let nunjucks;
  let render;

  beforeEach(() => {
    render = jest.fn();

    nunjucks = {
      render,
    };
  });

  it('should call render on the given template path', () => {
    const fakeTemplatePath = 'some/path/to/a/template.njk';
    const fakeTemplateVars = { a: 'b' };

    renderTemplateFilter(nunjucks)(fakeTemplatePath, fakeTemplateVars);

    expect(nunjucks.render).toHaveBeenCalledWith(fakeTemplatePath, fakeTemplateVars);
  });
});
