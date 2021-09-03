const nunjucksTestRenderer = require('../nunjucks-render-helper');
const { deleteGlobalVars, matchesSnapshot } = require('../nunjucks-helper-functions');

describe('views/includes/head', () => {
  const includePath = '{% include "includes/head.njk" %}';

  describe('Google Analytics section', () => {
    beforeEach(() => {
      deleteGlobalVars(['cookies', 'googleAnalyticsId']);
    });

    it(`should not render if googleAnalyticsId and cookies.cookie_policy.usage are not set`, () => {
      matchesSnapshot(includePath);
    });

    it(`should not render if googleAnalyticsId is set but cookies.cookie_policy.usage is not set`, () => {
      nunjucksTestRenderer.addGlobal('googleAnalyticsId', 123);
      matchesSnapshot(includePath);
    });

    it(`should not render if googleAnalyticsId is not set but cookies.cookie_policy.usage is set`, () => {
      nunjucksTestRenderer.addGlobal('cookies', { cookie_policy: { usage: true } });
      matchesSnapshot(includePath);
    });

    it(`should render if googleAnalyticsId and cookies.cookie_policy.usage are set`, () => {
      nunjucksTestRenderer.addGlobal('googleAnalyticsId', 123);
      nunjucksTestRenderer.addGlobal('cookies', { cookie_policy: { usage: true } });
      matchesSnapshot(includePath);
    });
  });

  describe('Google Tag Manager section', () => {
    beforeEach(() => {
      deleteGlobalVars(['featureFlag', 'googleTagManagerId']);
    });

    it(`should not render if featureFlag.googleTagManager and googleTagManagerId are not set`, () => {
      matchesSnapshot(includePath);
    });

    it(`should not render if featureFlag.googleTagManager is set but googleTagManagerId is not set`, () => {
      nunjucksTestRenderer.addGlobal('featureFlag', { googleTagManager: true });
      matchesSnapshot(includePath);
    });

    it(`should not render if featureFlag.googleTagManager is not set but googleTagManagerId is set`, () => {
      nunjucksTestRenderer.addGlobal('googleTagManagerId', 456);
      matchesSnapshot(includePath);
    });

    it(`should render if featureFlag.googleTagManager and googleTagManagerId are set`, () => {
      nunjucksTestRenderer.addGlobal('googleTagManagerId', 456);
      nunjucksTestRenderer.addGlobal('featureFlag', { googleTagManager: true });
      matchesSnapshot(includePath);
    });
  });
});
