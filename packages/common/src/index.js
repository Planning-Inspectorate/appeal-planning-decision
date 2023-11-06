const healthcheck = require('./health');
const prometheus = require('./prometheus');
const utils = require('./utils');
const documentTypes = require('./document-types');
const enterCodeConfig = require('./enter-code-config.js');
const blobStorage = require('./blobStorage');

module.exports = {
	healthcheck,
	prometheus,
	utils,
	documentTypes,
	enterCodeConfig,
	...blobStorage
};
