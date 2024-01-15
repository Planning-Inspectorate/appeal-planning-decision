const config = require('../common/src/config');
const { AppealsApiClient } = require('packages/common/src/client/appeals-api-client');

/**
 *
 * @param {import('@azure/functions').InvocationContext} context
 * @param {*} msg
 */
module.exports = async function (context, msg) {
	context.log('processing appeal-case message', msg);
	if (!Object.hasOwn(msg, 'caseReference')) {
		throw new Error('invalid message, caseReference is required');
	}
	if (config.API.HOSTNAME === undefined) {
		throw new Error('process.env.FO_APPEALS_API_HOSTNAME not set');
	}
	const client = new AppealsApiClient(config.API.HOSTNAME, config.API.TIMEOUT);
	await client.putAppealCase(msg); // API will validate the message and throw if there is an error
};
