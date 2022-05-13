const nunjucksTestRenderer = require('../nunjucks-render-helper');
const { deleteGlobalVars, matchesSnapshot } = require('../nunjucks-helper-functions');

describe('views/includes/body-start', () => {
  describe('Google Tag Manager section', () => {
    const includePath = '{% include "includes/body-start.njk" %}';

    beforeEach(() => {
      deleteGlobalVars(['googleTagManagerId']);
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
