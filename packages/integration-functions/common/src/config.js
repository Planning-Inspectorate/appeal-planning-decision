module.exports = {
	AZURE: {
		BO_SERVICEBUS: {
			HOSTNAME: process.env.ServiceBusConnection__fullyQualifiedNamespace,
			LISTED_BUILDING: {
				TOPIC_NAME: 'listed-building',
				MAX_BATCH_SIZE: 100 // todo: how to get setting from env alongside azure defaults
			}
		},
		FUNCTION_APP: {
			STORAGE_CONNECTION: process.env.AzureWebJobsStorage,
			LISTED_BUILDING: {
				CONTAINER: 'listedbuildings',
				FILENAME: 'listed-building.json'
			}
		}
	},
	API: {
		HOSTNAME: process.env.FO_APPEALS_API_HOSTNAME,
		TIMEOUT: parseInt(process.env.FO_APPEALS_API || '10000')
	}
};
