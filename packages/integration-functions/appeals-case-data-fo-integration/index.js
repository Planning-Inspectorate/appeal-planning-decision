const got = require('got');

module.exports = async function (context, appealsCaseMessage) {
	context.log('JavaScript ServiceBus topic trigger function processed message', appealsCaseMessage);
	const { body } = appealsCaseMessage;
	const APPEALS_CASE_DATA_URL = `https://${process.env.FO_APPEALS_API}/appeals-case-data`;
	await got
		.post(APPEALS_CASE_DATA_URL, {
			json: body
		})
		.json();
};
