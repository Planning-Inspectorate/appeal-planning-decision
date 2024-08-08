const utils = require('./utils');
const { documentTypes } = require('./document-types');
const enterCodeConfig = require('./enter-code-config.js');
const blobStorage = require('./blobStorage');
const viewModelMaps = require('./view-model-maps');
const { isFeatureActive } = require('./is-feature-active');
const { getRoutes, spoolRoutes } = require('./router');
const { mapTypeCodeToAppealId } = require('./appeal-type-to-id');

module.exports = {
	utils,
	documentTypes,
	enterCodeConfig,
	...blobStorage,
	getRoutes,
	...viewModelMaps,
	isFeatureActive,
	spoolRoutes,
	mapTypeCodeToAppealId
};
