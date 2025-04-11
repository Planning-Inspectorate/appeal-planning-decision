const { NotifyClient } = require('notifications-node-client');

/**
 * @param {string} apiKey
 * @param {string} [baseUrl]
 * @param {string} [serviceId]
 * @returns {[string, string?, string?]}
 */
function getNotifyClientArguments(apiKey, baseUrl, serviceId) {
	const args = [];
	if (baseUrl) {
		if (!serviceId) {
			throw new Error('If baseUrl is provided, serviceId must be provided also.');
		}
		args.push(baseUrl, serviceId);
	}
	args.push(apiKey);
	return args;
}

function createNotifyClient(notifyUrl, serviceId, apiKey) {
	return new NotifyClient(...getNotifyClientArguments(apiKey, notifyUrl, serviceId));
}

module.exports = {
	createNotifyClient,
	getNotifyClientArguments
};
