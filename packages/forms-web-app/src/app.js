const express = require('express');
const compression = require('compression');
const lusca = require('lusca');
const path = require('path');
const cookieParser = require('cookie-parser');
const nunjucks = require('nunjucks');
const dateFilter = require('nunjucks-date-filter');
const session = require('express-session');
const pinoExpress = require('express-pino-logger');
const uuid = require('uuid');
const fileUpload = require('express-fileupload');
const {
  prometheus,
  middleware: commonMiddleware,
  nunjucks: { filters: commonNunjucksFilters },
} = require('@pins/common');
const sessionConfig = require('./lib/session');
const appealSiteAddressToArray = require('./lib/appeal-site-address-to-array');
const fileSizeDisplayHelper = require('./lib/file-size-display-helper');
const filterByKey = require('./lib/filter-by-key');
const addKeyValuePair = require('./lib/add-key-value-pair');
const navigationHistoryMiddleware = require('./middleware/navigation-history');
const navigationHistoryToNunjucksMiddleware = require('./middleware/navigation-history-to-nunjucks');
require('express-async-errors');

const config = require('./config');
const logger = require('./lib/logger');
const routes = require('./routes');

const app = express();

prometheus.init(app);

app.use(
  pinoExpress({
    logger,
    genReqId: () => uuid.v4(),
  })
);

const isDev = app.get('env') === 'development';

const nunjucksConfig = {
  autoescape: true,
  noCache: true,
  watch: isDev,
  express: app,
};

const viewPaths = [
  path.join(__dirname, '..', 'node_modules', 'govuk-frontend'),
  path.join(__dirname, '..', 'node_modules', '@ministryofjustice', 'frontend'),
  path.join(__dirname, '..', '..', 'common', 'src', 'views'),
  path.join(__dirname, '..', 'node_modules', '@pins', 'common', 'src', 'frontend'),
  path.join(__dirname, 'views'),
];

const env = nunjucks.configure(viewPaths, nunjucksConfig);
env.addFilter('appealSiteAddressToArray', appealSiteAddressToArray);

dateFilter.setDefaultFormat(config.application.defaultDisplayDateFormat);
env.addFilter('date', dateFilter);

env.addFilter('formatBytes', fileSizeDisplayHelper);
env.addFilter('filterByKey', filterByKey);
env.addFilter('addKeyValuePair', addKeyValuePair);
env.addFilter('render', commonNunjucksFilters.renderTemplate(nunjucks));
env.addGlobal('fileSizeLimits', config.fileUpload.pins);
env.addGlobal('googleAnalyticsId', config.server.googleAnalyticsId);

if (config.server.useSecureSessionCookie) {
  app.set('trust proxy', 1); // trust first proxy
}

app.use(compression());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session(sessionConfig()));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(
  '/public/common',
  express.static(path.join(__dirname, '..', '..', 'common', 'src', 'public'))
);
app.use(
  '/assets',
  express.static(path.join(__dirname, '..', 'node_modules', 'accessible-autocomplete', 'dist')),
  express.static(path.join(__dirname, '..', 'node_modules', 'govuk-frontend', 'govuk', 'assets'))
);
app.use(
  '/assets/govuk/all.js',
  express.static(path.join(__dirname, '..', 'node_modules', 'govuk-frontend', 'govuk', 'all.js'))
);
app.use(fileUpload(config.fileUpload));
app.use(commonMiddleware.removeUnwantedCookies);
app.use(commonMiddleware.flashMessageCleanup);
app.use(commonMiddleware.flashMessageToNunjucks(env));
app.use(navigationHistoryMiddleware());
app.use(navigationHistoryToNunjucksMiddleware(env));

// Routes
app.use('/', routes);

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
