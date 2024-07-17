const utils = require('./utils');
const { documentTypes } = require('./document-types');
const enterCodeConfig = require('./enter-code-config.js');
const blobStorage = require('./blobStorage');
const { getRoutes } = require('./router');
const viewModelMaps = require('./view-model-maps');
const { isFeatureActive } = require('./is-feature-active');
const { spoolRoutes } = require('./router-v2');

module.exports = {
	utils,
	documentTypes,
	enterCodeConfig,
	...blobStorage,
	getRoutes,
	...viewModelMaps,
	isFeatureActive,
	spoolRoutes
};
