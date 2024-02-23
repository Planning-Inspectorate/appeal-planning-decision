const { isFeatureActive } = require('@pins/common');
const config = require('./config');

exports.isFeatureActive = isFeatureActive(config);
