const nunjucksTestRenderer = require('../nunjucks-render-helper');

describe('views/includes/head', () => {
  describe('Google Analytics section', () => {
    beforeEach(() => {
      ['cookies', 'googleAnalyticsId'].forEach((key) => {
        delete nunjucksTestRenderer.globals[key];
        expect(() => nunjucksTestRenderer.getGlobal(key)).toThrow(`global not found: ${key}`);
      });
    });

    const matchesSnapshop = () =>
      expect(
        nunjucksTestRenderer.renderString(`
    {% include "includes/head.njk" %}
    `)
      ).toMatchSnapshot();

    it(`should not render if googleAnalyticsId and cookies.cookie_policy.usage are not set`, () => {
      matchesSnapshop();
    });

    it(`should not render if googleAnalyticsId is set but cookies.cookie_policy.usage is not set`, () => {
      nunjucksTestRenderer.addGlobal('googleAnalyticsId', 123);
      matchesSnapshop();
    });

    it(`should not render if googleAnalyticsId is not set but cookies.cookie_policy.usage is set`, () => {
      nunjucksTestRenderer.addGlobal('cookies', { cookie_policy: { usage: true } });
      matchesSnapshop();
    });

    it(`should render if googleAnalyticsId and cookies.cookie_policy.usage are set`, () => {
      nunjucksTestRenderer.addGlobal('googleAnalyticsId', 123);
      nunjucksTestRenderer.addGlobal('cookies', { cookie_policy: { usage: true } });
      matchesSnapshop();
    });
  });
});
