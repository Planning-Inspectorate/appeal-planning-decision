const { NotifyClient } = require('notifications-node-client');

function getNotifyClientArguments(baseUrl, serviceId, apiKey) {
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
	return new NotifyClient(
		...getNotifyClientArguments(notifyUrl, serviceId, apiKey)
	);
}

module.exports = {
	createNotifyClient,
	getNotifyClientArguments
};
