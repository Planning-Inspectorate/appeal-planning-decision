const { AppealsApiClient } = require('@pins/common/src/client/appeals-api-client');
const config = require('../config');

const apiClient = new AppealsApiClient(config.appeals.url, undefined, config.appeals.timeout);

module.exports = {
	apiClient
};
