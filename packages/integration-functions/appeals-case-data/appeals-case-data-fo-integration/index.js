const httpClient = require('../../common/src/http/httpClient');
/*
Service Bus Namespace:
    Deployment name: appeals-case-data-ukw-dev
    Subscription: pins-odt-apps-dev-sub
    Resource group: pins-rg-appeals-service-dev-uks-001
    Correlation ID: db204df6-27b9-44de-8d8e-132b78b7898d
    Connection String: Endpoint=sb://appeals-case-data-ukw-dev.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=ZHLEbaUP/jKVV1Gz5RRnmftEBdHR42Rco+ASbBJhU8w=
Queue:
    Queue name: appeals-case-data-queue
*/

module.exports = async function (context, appealsCaseMessage) {
	context.log('JavaScript ServiceBus topic trigger function processed message', appealsCaseMessage);
	const { body } = appealsCaseMessage;
	const BO_APPEALS_API = `http://${process.env.BO_APPEALS_API}/`;
	context.log(BO_APPEALS_API);
	await httpClient.jsonRequest(context, body, httpClient.METHOD_POST, BO_APPEALS_API);
};
