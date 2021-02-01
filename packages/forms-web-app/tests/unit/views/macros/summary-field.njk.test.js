const nunjucksTestRenderer = require('../nunjucks-render-helper');

describe('views/macros/summary-field', () => {
  it('should render without a value or attributes', () => {
    expect(
      nunjucksTestRenderer.renderString(`
    {%- from 'macros/summary-field.njk' import summaryField with context -%}
    {{- summaryField() -}}
    `)
    ).toMatchSnapshot();
  });

  it('should render with a value and without attributes', () => {
    expect(
      nunjucksTestRenderer.renderString(`
    {%- from 'macros/summary-field.njk' import summaryField with context -%}
    {{- summaryField(value = 'an example value' ) -}}
    `)
    ).toMatchSnapshot();
  });

  it('should render without a value and with attributes', () => {
    expect(
      nunjucksTestRenderer.renderString(`
    {%- from 'macros/summary-field.njk' import summaryField with context -%}
    {{- summaryField(attributes = { 'a': 'b', 'c': 'd' } ) -}}
    `)
    ).toMatchSnapshot();
  });

  it('should render with a value and attributes', () => {
    expect(
      nunjucksTestRenderer.renderString(`
    {%- from 'macros/summary-field.njk' import summaryField with context -%}
    {{- summaryField(value = 'an example value', attributes = { 'a': 'b', 'c': 'd' } ) -}}
    `)
    ).toMatchSnapshot();
  });
});
