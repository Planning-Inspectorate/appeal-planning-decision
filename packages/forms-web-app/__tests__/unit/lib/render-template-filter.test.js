const renderTemplateFilter = require('../../../src/lib/render-template-filter');

describe('lib/render-template-filter', () => {
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
