const httpClient = require('../common/src/http/httpClient');

module.exports = async function (context, appealsCaseMessage) {
	context.log('JavaScript ServiceBus topic trigger function processed message', appealsCaseMessage);
	const { body } = appealsCaseMessage;
	const FO_APPEALS_API = `http://${process.env.FO_APPEALS_API}/`;
	context.log(FO_APPEALS_API);
	var response = await httpClient.jsonRequest(
		context,
		body,
		httpClient.METHOD_POST,
		FO_APPEALS_API
	);
	context.log.info(response);
};
