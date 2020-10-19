const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const nunjucks = require('nunjucks');

const indexRouter = require('./routes/index');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use(
  '/node_modules/govuk-frontend',
  express.static(path.join(__dirname, '/node_modules/govuk-frontend')),
);

app.use('/', indexRouter);
app.set('views', `${__dirname}/views`);
app.set('view engine', 'njk');

const isDev = app.get('env') === 'development';

const nunjucksConfig = {
  autoescape: true,
  noCache: isDev,
  watch: isDev,
  express: app,
};

const viewPaths = [
  path.join(__dirname, '/node_modules/govuk-frontend'),
  path.join(__dirname, '/views'),
];

nunjucks.configure(viewPaths, nunjucksConfig);

module.exports = app;
