module.exports = {
	AZURE: {
		BO_SERVICEBUS: {
			HOSTNAME: process.env.ServiceBusConnection__fullyQualifiedNamespace,
			TOPIC_NAME: {
				APPEAL_HAS: process.env.SB_TOPIC_NAME_APPEAL_HAS || 'appeal-has',
				APPEAL_S78: process.env.SB_TOPIC_NAME_APPEAL_S78 || 'appeal-s78',
				APPEAL_DOCUMENT: process.env.SB_TOPIC_NAME_APPEAL_DOCUMENT || 'appeal-document',
				APPEAL_EVENT: process.env.SB_TOPIC_NAME_APPEAL_EVENT || 'appeal-event',
				APPEAL_SERVICE_USER: process.env.SB_TOPIC_NAME_APPEAL_SERVICE_USER || 'appeal-service-user',
				LISTED_BUILDING: process.env.SB_TOPIC_NAME_LISTED_BUILDING || 'listed-building',
				APPEAL_REPRESENTATION:
					process.env.SB_TOPIC_NAME_APPEAL_REPRESENTATION || 'appeal-representation'
			},
			SUBSCRIPTION_NAME: {
				APPEAL_HAS: process.env.SB_SUBSCRIPTION_NAME_APPEAL_HAS || 'appeal-has-fo-sub',
				APPEAL_S78: process.env.SB_SUBSCRIPTION_NAME_APPEAL_S78 || 'appeal-s78-fo-sub',
				APPEAL_DOCUMENT:
					process.env.SB_SUBSCRIPTION_NAME_APPEAL_DOCUMENT || 'appeal-document-fo-sub',
				APPEAL_EVENT: process.env.SB_SUBSCRIPTION_NAME_APPEAL_EVENT || 'appeal-event-fo-sub',
				APPEAL_SERVICE_USER:
					process.env.SB_SUBSCRIPTION_NAME_APPEAL_SERVICE_USER || 'appeal-service-user-fo-sub',
				LISTED_BUILDING:
					process.env.SB_SUBSCRIPTION_NAME_LISTED_BUILDING || 'listed-building-fo-sub',
				APPEAL_REPRESENTATION:
					process.env.SB_SUBSCRIPTION_NAME_APPEAL_REPRESENTATION || 'appeal-representation-fo-sub'
			},
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
		TIMEOUT: parseInt(process.env.FO_APPEALS_API_TIMEOUT || '10000')
	},
	oauth: {
		baseUrl: process.env.AUTH_BASE_URL,
		clientID: process.env.CLIENT_ID,
		clientSecret: process.env.CLIENT_SECRET
	},
	timer: {
		// default to every monday at 03:00:00 server time
		schedule: process.env.CLEANUP_SCHEDULE || '0 0 3 * * MON'
	}
};
