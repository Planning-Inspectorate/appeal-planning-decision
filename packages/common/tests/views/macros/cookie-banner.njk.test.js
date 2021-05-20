const nunjucksTestRenderer = require('../nunjucks-render-helper');

describe('views/macros/cookie-banner', () => {
  it(`should have sensible default attributes`, () => {
    expect(
      nunjucksTestRenderer.renderString(`
    {%- from 'macros/cookie-banner.njk' import cookieBanner with context -%}
    {{- cookieBanner() -}}
    `)
    ).toMatchSnapshot();
  });

  it(`should allow setting a custom serviceName`, () => {
    expect(
      nunjucksTestRenderer.renderString(`
    {%- from 'macros/cookie-banner.njk' import cookieBanner with context -%}
    {{- cookieBanner({ serviceName: "test service name here" }) -}}
    `)
    ).toMatchSnapshot();
  });

  it(`should allow setting a custom cookiePagePath`, () => {
    expect(
      nunjucksTestRenderer.renderString(`
    {%- from 'macros/cookie-banner.njk' import cookieBanner with context -%}
    {{- cookieBanner({ cookiePagePath: "/some/path/here" }) -}}
    `)
    ).toMatchSnapshot();
  });

  it(`should allow setting all custom attributes`, () => {
    expect(
      nunjucksTestRenderer.renderString(`
    {%- from 'macros/cookie-banner.njk' import cookieBanner with context -%}
    {{- cookieBanner({ cookiePagePath: "/a/b/c", serviceName: "custom service name" }) -}}
    `)
    ).toMatchSnapshot();
  });
});
