const { appealsApi } = require('../server.config');
const { AppealsApiClient } = require('@pins/common/src/client/appeals-api-client');

const apiClient = new AppealsApiClient(appealsApi.baseUrl, undefined, appealsApi.timeout);

module.exports = {
	apiClient
};
