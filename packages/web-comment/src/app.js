const express = require('express');
const compression = require('compression');
const lusca = require('lusca');
const path = require('path');
const cookieParser = require('cookie-parser');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');

const pinoExpress = require('express-pino-logger');
const uuid = require('uuid');
require('express-async-errors');

const serverConfig = require('./server.config');
const logger = require('./logging/logger');
const { routes } = require('./routes');

const app = express();

app.use(
	pinoExpress({
		logger,
		genReqId: () => uuid.v4()
	})
);

app.use(bodyParser.json());

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
	path.join(__dirname, './'),
	path.join(__dirname, 'public'),
	path.join(__dirname, 'src'),
	path.join(__dirname, 'routes'),
	path.join(__dirname, 'views')
];

nunjucks.configure(viewPaths, nunjucksConfig);

if (serverConfig.server.useSecureSessionCookie) {
	app.set('trust proxy', 1); // trust first proxy
}

app.use(compression());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(
	'/assets',
	// resolve accessible-autocomplete dist folder
	express.static(path.join(require.resolve('accessible-autocomplete'), '..')),
	express.static(path.join(govukFrontEndRoot, 'govuk', 'assets'))
);
app.use('/assets/govuk/all.js', express.static(path.join(govukFrontEndRoot, 'govuk', 'all.js')));

// Routes
Object.entries(routes).forEach(([baseUrl, router]) => {
	console.log('🚀 ~ file: app.js:79 ~ Object.entries ~ baseUrl:', baseUrl);
	app.use(baseUrl, router);
});
// View Engine
app.set('view engine', 'njk');

// For working with req.subdomains, primarily for cookie control.
app.set('subdomain offset', serverConfig.server.subdomainOffset);

// Error handling
app
	.use((req, res, next) => {
		res.status(404).render('errors/not-found');
		next();
	})
	.use((err, req, res, next) => {
		logger.error({ err }, 'Unhandled exception');

		res.status(500).render('errors/unhandled-exception');
		next();
	});

module.exports = app;
