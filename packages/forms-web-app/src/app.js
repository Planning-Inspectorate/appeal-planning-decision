const express = require('express');
const compression = require('compression');
const lusca = require('lusca');
const { configureCSP } = require('./csp');
const path = require('path');
const cookieParser = require('cookie-parser');
const nunjucks = require('nunjucks');
const dateFilter = require('nunjucks-date-filter');
const session = require('express-session');
const { pinoHttp } = require('pino-http');
const uuid = require('uuid');
const fileUpload = require('express-fileupload');
const sessionConfig = require('./lib/session');
const appealSiteAddressToArray = require('./lib/appeal-site-address-to-array');
const fileSizeDisplayHelper = require('./lib/file-size-display-helper');
const filterByKey = require('./lib/filter-by-key');
const addKeyValuePair = require('./lib/add-key-value-pair');
const renderTemplateFilter = require('./lib/render-template-filter');
const { arrayHasItems } = require('@pins/common/src/lib/array-has-items');
const flashMessageCleanupMiddleware = require('./middleware/flash-message-cleanup');
const flashMessageToNunjucks = require('./middleware/flash-message-to-nunjucks');
const removeUnwantedCookiesMiddelware = require('./middleware/remove-unwanted-cookies');
const {
	setLocalslDisplayCookieBannerValue
} = require('./middleware/set-locals-display-cookie-banner-value');
const navigationHistoryMiddleware = require('./middleware/navigation-history');
const navigationHistoryToNunjucksMiddleware = require('./middleware/navigation-history-to-nunjucks');
const { mapToErrorSummary } = require('#utils/filters/map-to-error-summary');
require('express-async-errors');

const config = require('./config');
const logger = require('./lib/logger');
const routes = require('./routes');
const { spoolRoutes } = require('@pins/common');

const app = express();

app.use(
	pinoHttp({
		logger,
		genReqId: () => uuid.v4(),
		autoLogging: {
			ignore: (req) => {
				if (req.url?.startsWith('/public/')) return true;
				if (req.url?.startsWith('/assets/')) return true;
				if (req.headers['user-agent'] === 'AlwaysOn') return true;

				return false;
			}
		},
		serializers: {
			req: (req) => ({
				id: req.id,
				method: req.method,
				url: req.url,
				query: req.query,
				params: req.params
			}),
			res: (res) => ({
				statusCode: res.statusCode
			})
		}
	})
);

const isDev = app.get('env') === 'development';

const nunjucksConfig = {
	autoescape: true,
	noCache: true,
	watch: isDev,
	express: app
};

// resolve the govuk-frontend module folder
// */govuk-frontend/govuk/all.js -> */govuk-frontend/
const govukFrontEndRoot = path.join(require.resolve('govuk-frontend'), '..', '..');

const viewPaths = [
	govukFrontEndRoot,
	// */@ministryofjustice/frontend/moj/all.js -> */@ministryofjustice/frontend
	path.join(require.resolve('@ministryofjustice/frontend'), '..', '..'),
	// */@pins/common/src/index.js -> */@pins/common/src/frontend
	path.join(require.resolve('@pins/common'), '..', 'frontend'),
	path.join(__dirname, 'views'),
	path.join(__dirname, 'dynamic-forms'),
	path.join(__dirname, 'routes/v2'),
	path.join(__dirname, 'public')
];

const env = nunjucks.configure(viewPaths, nunjucksConfig);
env.addFilter('appealSiteAddressToArray', appealSiteAddressToArray);
env.addFilter('mapToErrorSummary', mapToErrorSummary);

dateFilter.setDefaultFormat(config.application.defaultDisplayDateFormat);
env.addFilter('date', dateFilter);

env.addFilter('formatBytes', fileSizeDisplayHelper);
env.addFilter('filterByKey', filterByKey);
env.addFilter('addKeyValuePair', addKeyValuePair);
env.addFilter('render', renderTemplateFilter(nunjucks));
env.addFilter('hasItems', arrayHasItems);
env.addGlobal('fileSizeLimits', config.fileUpload.pins);
env.addGlobal('googleAnalyticsId', config.server.googleAnalyticsId);
env.addGlobal('googleTagManagerId', config.server.googleTagManagerId);
env.addGlobal('featureFlag', config.featureFlag);

if (config.server.useSecureSessionCookie) {
	app.set('trust proxy', 1); // trust first proxy
}

app.disable('x-powered-by');
app.use((req, res, next) => {
	res.append('X-Content-Type-Options', 'nosniff');
	next();
});

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(removeUnwantedCookiesMiddelware);
app.use(setLocalslDisplayCookieBannerValue);
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(
	'/assets',
	// resolve accessible-autocomplete dist folder
	express.static(path.join(require.resolve('accessible-autocomplete'), '..')),
	express.static(path.join(govukFrontEndRoot, 'govuk', 'assets'))
);
app.use('/assets/govuk/all.js', express.static(path.join(govukFrontEndRoot, 'govuk', 'all.js')));
app.use(fileUpload({ ...config.fileUpload /*useTempFiles: true*/ }));
app.use(session(sessionConfig()));
app.use(navigationHistoryMiddleware()); // Above lusca so csrf token isn't in session yet
app.use(lusca.csrf()); // Depends on fileupload and session
configureCSP(app);
app.use(flashMessageCleanupMiddleware);
app.use(flashMessageToNunjucks(env));
app.use(navigationHistoryToNunjucksMiddleware(env));

// Routes
app.use('/', routes);
spoolRoutes(app, path.join(__dirname, './routes/v2'), { backwardsCompatibilityModeEnabled: true });

// View Engine
app.set('view engine', 'njk');

// For working with req.subdomains, primarily for cookie control.
app.set('subdomain offset', config.server.subdomainOffset);

// Error handling
app
	.use((req, res, next) => {
		res.status(404).render('error/not-found');
		next();
	})
	.use((err, req, res, next) => {
		logger.error({ err }, 'Unhandled exception');

		res.status(500).render('error/unhandled-exception');
		next();
	});

module.exports = app;
