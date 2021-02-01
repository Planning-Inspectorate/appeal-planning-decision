const nunjucks = require('nunjucks');
const path = require('path');

const filterByKey = require('../../../src/lib/filter-by-key');
const addKeyValuePair = require('../../../src/lib/add-key-value-pair');

const viewPaths = [
  path.join(__dirname, '../../..', 'node_modules', 'govuk-frontend'),
  path.join(__dirname, '../../..', 'node_modules', '@ministryofjustice', 'frontend'),
  path.join(__dirname, '../../..', 'src', 'views'),
];

const nunjucksConfig = {
  noCache: true,
};

const env = nunjucks.configure(viewPaths, nunjucksConfig);

env.addFilter('filterByKey', filterByKey);
env.addFilter('addKeyValuePair', addKeyValuePair);

module.exports = env;
