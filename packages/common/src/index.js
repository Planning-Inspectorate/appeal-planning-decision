const functional = require('./functional');
const healthcheck = require('./health');
const prometheus = require('./prometheus');
const utils = require('./utils');
const documentTypes = require('./document-types');
const enterCodeConfig = require('./enter-code-config.js');

module.exports = {
	functional,
	healthcheck,
	prometheus,
	utils,
	documentTypes,
	enterCodeConfig
};
