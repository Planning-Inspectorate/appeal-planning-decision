const got = require('got');

/**
 * @param {import('@azure/functions').Context} context
 * @param {*} msg
 */
module.exports = async function (context, msg) {
	context.log('Handle listed building message', msg);

	if (Array.isArray(msg)) {
		await processListedBuilding(msg);
		return;
	}

	await processListedBuilding([msg]);
};

async function processListedBuilding(listedBuildingMessages) {
	const APPEALS_CASE_DATA_URL = `https://${process.env.FO_APPEALS_API}/listed-buildings`;
	await got
		.put(APPEALS_CASE_DATA_URL, {
			json: listedBuildingMessages
		})
		.json();
}
