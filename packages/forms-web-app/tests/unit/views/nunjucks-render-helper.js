const nunjucks = require('nunjucks');
const path = require('path');
const {
  nunjucks: {
    filters: { renderTemplate },
  },
} = require('@pins/common');
const dateFilter = require('nunjucks-date-filter');
const filterByKey = require('../../../src/lib/filter-by-key');
const addKeyValuePair = require('../../../src/lib/add-key-value-pair');
const appealSiteAddressToArray = require('../../../src/lib/appeal-site-address-to-array');

const viewPaths = [
  path.join(__dirname, '../../..', 'node_modules', 'govuk-frontend'),
  path.join(__dirname, '../../..', 'node_modules', '@ministryofjustice', 'frontend'),
  path.join(__dirname, '../../../..', 'common', 'src', 'views'),
  path.join(__dirname, '../../..', 'node_modules', '@pins', 'common', 'src', 'frontend'),
  path.join(__dirname, '../../..', 'src', 'views'),
];

const nunjucksConfig = {
  noCache: true,
};

const env = nunjucks.configure(viewPaths, nunjucksConfig);

env.addFilter('filterByKey', filterByKey);
env.addFilter('addKeyValuePair', addKeyValuePair);
env.addFilter('appealSiteAddressToArray', appealSiteAddressToArray);
env.addFilter('date', dateFilter);
env.addFilter('render', renderTemplate);

module.exports = env;
