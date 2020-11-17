const express = require('express');
const compression = require('compression');
const lusca = require('lusca');
const path = require('path');
const cookieParser = require('cookie-parser');
const nunjucks = require('nunjucks');
const dateFilter = require('nunjucks-date-filter');
const session = require('express-session');
const redis = require('redis');
const connectRedis = require('connect-redis');

const config = require('./config');

const applicationNameRouter = require('./routes/application-name');
const applicationNumberRouter = require('./routes/application-number');
const checkAnswersRouter = require('./routes/check-answers');
const eligibilityRouter = require('./routes/eligibility');
const submitAppealRouter = require('./routes/submit-appeal');
const indexRouter = require('./routes/index');
const taskListRouter = require('./routes/task-list');
const yourDetailsRouter = require('./routes/your-details');

const app = express();

const RedisStore = connectRedis(session);

const { sessionSecret } = config.server;

if (!sessionSecret) {
  throw new Error('Session secret must be set');
}

const sessionConfig = {
  store: new RedisStore({
    client: redis.createClient(config.redis()),
  }),
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: {},
};

if (config.server.useSecureSessionCookie) {
  app.set('trust proxy', 1); // trust first proxy
  sessionConfig.cookie.secure = true; // serve secure cookies
}

app.use(compression());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session(sessionConfig));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(
  '/assets',
  express.static(path.join(__dirname, '..', 'node_modules', 'govuk-frontend', 'govuk', 'assets'))
);

// Routes
app.use('/', indexRouter);
app.use('/application-name', applicationNameRouter);
app.use('/application-number', applicationNumberRouter);
app.use('/check-answers', checkAnswersRouter);
app.use('/eligibility', eligibilityRouter);
app.use('/submit-appeal', submitAppealRouter);
app.use('/task-list', taskListRouter);
app.use('/your-details', yourDetailsRouter);

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
  path.join(__dirname, '..', 'node_modules', 'govuk-frontend'),
  path.join(__dirname, '..', 'node_modules', '@ministryofjustice', 'frontend'),
  path.join(__dirname, 'views'),
];

const env = nunjucks.configure(viewPaths, nunjucksConfig);
env.addFilter('date', dateFilter);

module.exports = app;
