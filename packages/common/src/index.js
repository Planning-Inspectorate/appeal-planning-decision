const healthcheck = require('./health');
const prometheus = require('./prometheus');
const utils = require('./utils');
const documentTypes = require('./document-types');
const enterCodeConfig = require('./enter-code-config.js');
const blobStorage = require('./blobStorage');
const { getRoutes } = require('./router');
const viewModelMaps = require('./view-model-maps');
const { isFeatureActive } = require('./is-feature-active');

module.exports = {
	healthcheck,
	prometheus,
	utils,
	documentTypes,
	enterCodeConfig,
	...blobStorage,
	getRoutes,
	...viewModelMaps,
	isFeatureActive
};
