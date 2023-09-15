const got = require('got');

module.exports = async function (context, appealsCaseMessage) {
	context.log('JavaScript ServiceBus topic trigger function processed message', appealsCaseMessage);
	const { body } = appealsCaseMessage;
	const FO_APPEALS_API = `https://${process.env.FO_APPEALS_API}/`;
	await got
		.post(FO_APPEALS_API, {
			json: body
		})
		.json();
};
