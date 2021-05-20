const nunjucksTestRenderer = require('../nunjucks-render-helper');

describe('views/macros/cookie-banner-rejected', () => {
  it(`should have sensible default attributes`, () => {
    expect(
      nunjucksTestRenderer.renderString(`
    {%- from 'macros/cookie-banner-rejected.njk' import cookieBannerRejected with context -%}
    {{- cookieBannerRejected() -}}
    `)
    ).toMatchSnapshot();
  });

  it(`should allow setting a custom serviceName`, () => {
    expect(
      nunjucksTestRenderer.renderString(`
    {%- from 'macros/cookie-banner-rejected.njk' import cookieBannerRejected with context -%}
    {{- cookieBannerRejected({ serviceName: "test service name here" }) -}}
    `)
    ).toMatchSnapshot();
  });

  it(`should allow setting a custom cookiePagePath`, () => {
    expect(
      nunjucksTestRenderer.renderString(`
    {%- from 'macros/cookie-banner-rejected.njk' import cookieBannerRejected with context -%}
    {{- cookieBannerRejected({ cookiePagePath: "/some/path/here" }) -}}
    `)
    ).toMatchSnapshot();
  });

  it(`should allow setting all custom attributes`, () => {
    expect(
      nunjucksTestRenderer.renderString(`
    {%- from 'macros/cookie-banner-rejected.njk' import cookieBannerRejected with context -%}
    {{- cookieBannerRejected({ cookiePagePath: "/a/b/c", serviceName: "custom service name" }) -}}
    `)
    ).toMatchSnapshot();
  });
});
