const nunjucksTestRenderer = require('../nunjucks-render-helper');

describe('views/macros/cookie-banner-accepted', () => {
  it(`should have sensible default attributes`, () => {
    expect(
      nunjucksTestRenderer.renderString(`
    {%- from 'macros/cookie-banner-accepted.njk' import cookieBannerAccepted with context -%}
    {{- cookieBannerAccepted() -}}
    `)
    ).toMatchSnapshot();
  });

  it(`should allow setting a custom serviceName`, () => {
    expect(
      nunjucksTestRenderer.renderString(`
    {%- from 'macros/cookie-banner-accepted.njk' import cookieBannerAccepted with context -%}
    {{- cookieBannerAccepted({ serviceName: "test service name here" }) -}}
    `)
    ).toMatchSnapshot();
  });

  it(`should allow setting a custom cookiePagePath`, () => {
    expect(
      nunjucksTestRenderer.renderString(`
    {%- from 'macros/cookie-banner-accepted.njk' import cookieBannerAccepted with context -%}
    {{- cookieBannerAccepted({ cookiePagePath: "/some/path/here" }) -}}
    `)
    ).toMatchSnapshot();
  });

  it(`should allow setting all custom attributes`, () => {
    expect(
      nunjucksTestRenderer.renderString(`
    {%- from 'macros/cookie-banner-accepted.njk' import cookieBannerAccepted with context -%}
    {{- cookieBannerAccepted({ cookiePagePath: "/a/b/c", serviceName: "custom service name" }) -}}
    `)
    ).toMatchSnapshot();
  });
});
