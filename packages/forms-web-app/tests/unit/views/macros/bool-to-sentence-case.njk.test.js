const nunjucksTestRenderer = require('../nunjucks-render-helper');

describe('views/macros/bool-to-sentence-case', () => {
  it(`should handle null input`, () => {
    expect(
      nunjucksTestRenderer.renderString(`
    {%- from 'macros/bool-to-sentence-case.njk' import boolToSentenceCaseField with context -%}
    {{- boolToSentenceCaseField(value = null ) -}}
    `)
    ).toMatchSnapshot();
  });

  it(`should display 'Yes' whene value is true`, () => {
    expect(
      nunjucksTestRenderer.renderString(`
    {%- from 'macros/bool-to-sentence-case.njk' import boolToSentenceCaseField with context -%}
    {{- boolToSentenceCaseField(value = true ) -}}
    `)
    ).toMatchSnapshot();
  });

  it(`should display 'No' whene value is false`, () => {
    expect(
      nunjucksTestRenderer.renderString(`
    {%- from 'macros/bool-to-sentence-case.njk' import boolToSentenceCaseField with context -%}
    {{- boolToSentenceCaseField(value = false, attributes = { 'some': 'attributes', 'go': 'here' } ) -}}
    `)
    ).toMatchSnapshot();
  });
});
