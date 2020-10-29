const express = require('express');
const compression = require('compression');
const lusca = require('lusca');
const path = require('path');
const cookieParser = require('cookie-parser');
const nunjucks = require('nunjucks');

const indexRouter = require('./routes/index');
const eligibilityRouter = require('./routes/eligibility');

const app = express();

app.use(compression());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use(
  '/assets',
  express.static(path.join(__dirname, '../node_modules/govuk-frontend/govuk/assets'))
);

// Routes
app.use('/', indexRouter);
app.use('/eligibility', eligibilityRouter);

// View Engine
app.set('view engine', 'njk');

const isDev = app.get('env') === 'development';

const nunjucksConfig = {
  autoescape: true,
  noCache: true,
  watch: isDev,
  express: app,
};

const viewPaths = [
  path.join(__dirname, '../node_modules/govuk-frontend'),
  path.join(__dirname, '/views'),
];

nunjucks.configure(viewPaths, nunjucksConfig);

module.exports = app;
