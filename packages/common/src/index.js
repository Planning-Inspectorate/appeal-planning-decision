const healthcheck = require('./health');
const prometheus = require('./prometheus');
const utils = require('./utils');
const documentTypes = require('./document-types');
const enterCodeConfig = require('./enter-code-config.js');
const blobStorage = require('./blobStorage');
const { getRoutes } = require('./router');

module.exports = {
	healthcheck,
	prometheus,
	utils,
	documentTypes,
	enterCodeConfig,
	...blobStorage,
	getRoutes
};
