const nunjucksTestRenderer = require('../nunjucks-render-helper');
const { deleteGlobalVars, matchesSnapshot } = require('../nunjucks-helper-functions');

describe('views/includes/head', () => {
	const includePath = '{% include "includes/head.njk" %}';

	beforeEach(() => {
		deleteGlobalVars(['cookies', 'featureFlag', 'googleAnalyticsId', 'googleTagManagerId']);
	});

	it(`should not render if no ids set`, () => {
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

	it(`should not render if only tagmanager set`, () => {
		nunjucksTestRenderer.addGlobal('featureFlag', { googleTagManager: true });
		matchesSnapshot(includePath);
	});

	it(`should not render if googleTagManager and GA are set`, () => {
		nunjucksTestRenderer.addGlobal('featureFlag', { googleTagManager: true });
		nunjucksTestRenderer.addGlobal('googleAnalyticsId', 456);
		nunjucksTestRenderer.addGlobal('cookies', { cookie_policy: { usage: true } });
		matchesSnapshot(includePath);
	});

	it(`should render tagmanager if tagmanager and id are set`, () => {
		nunjucksTestRenderer.addGlobal('featureFlag', { googleTagManager: true });
		nunjucksTestRenderer.addGlobal('googleTagManagerId', 123);
		matchesSnapshot(includePath);
	});

	it(`should render tagmanager if all are set`, () => {
		nunjucksTestRenderer.addGlobal('featureFlag', { googleTagManager: true });
		nunjucksTestRenderer.addGlobal('googleTagManagerId', 123);
		nunjucksTestRenderer.addGlobal('googleAnalyticsId', 456);
		nunjucksTestRenderer.addGlobal('cookies', { cookie_policy: { usage: true } });

		matchesSnapshot(includePath);
	});
});
