const express = require('express');
const compression = require('compression');
const lusca = require('lusca');
const path = require('path');
const nunjucks = require('nunjucks');
const dateFilter = require('nunjucks-date-filter');
const pinoExpress = require('express-pino-logger');
const uuid = require('uuid');
const { prometheus } = require('@pins/common');
const bodyParser = require('body-parser');
const logger = require('./lib/logger');
const routes = require('./routes');
require('express-async-errors');
const app = express();

prometheus.init(app);


const nunjucksConfig = {
	autoescape: true,
	noCache: true,
	watch: true,
	express: app
};

const viewPaths = [
	path.join(__dirname, '..', 'node_modules', 'govuk-frontend'),
	path.join(__dirname, '..', 'node_modules', '@ministryofjustice', 'frontend'),
	path.join(__dirname, '..', 'node_modules', '@pins', 'common', 'src', 'frontend'),
	path.join(__dirname, 'views')
];

const env = nunjucks.configure(viewPaths, nunjucksConfig);


env.addFilter('date', dateFilter);

app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(
	'/assets',
	express.static(path.join(__dirname, '..', 'node_modules', 'accessible-autocomplete', 'dist')),
	express.static(path.join(__dirname, '..', 'node_modules', 'govuk-frontend', 'govuk', 'assets'))
);
app.use(
	'/assets/govuk/all.js',
	express.static(path.join(__dirname, '..', 'node_modules', 'govuk-frontend', 'govuk', 'all.js'))
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'njk');

app
	.use(
		pinoExpress({
			logger,
			genReqId: (req) => req.headers['x-correlation-id'] || uuid.v4()
		})
	)
	.use(bodyParser.json())
	.use(compression()) /* gzip compression */
	.use('/', routes);


module.exports = app;
