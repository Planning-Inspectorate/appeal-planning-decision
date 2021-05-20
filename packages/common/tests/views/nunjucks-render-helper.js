const nunjucks = require('nunjucks');
const path = require('path');
const dateFilter = require('nunjucks-date-filter');
const render = require('../../src/nunjucks/filters/render-template-filter');

const viewPaths = [
  path.join(__dirname, '../..', 'node_modules', 'govuk-frontend'),
  path.join(__dirname, '../..', 'node_modules', '@ministryofjustice', 'frontend'),
  path.join(__dirname, '../..', 'src', 'views'),
];

const nunjucksConfig = {
  noCache: true,
};

const env = nunjucks.configure(viewPaths, nunjucksConfig);

env.addFilter('date', dateFilter);
env.addFilter('render', render);

module.exports = env;
