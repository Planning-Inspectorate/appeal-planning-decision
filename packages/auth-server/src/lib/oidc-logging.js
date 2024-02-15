import logger from './logger.js';

/**
 *
 * @param {import('oidc-provider')} provider
 */
export function subscribe(provider) {
	const eventHandlers = [
		['access_token.destroyed', genericEventHandler],
		['access_token.saved', genericEventHandler],
		['access_token.issued', genericEventHandler],
		['authorization_code.consumed', genericEventHandler],
		['authorization_code.destroyed', genericEventHandler],
		['authorization_code.saved', genericEventHandler],
		['authorization.accepted', genericEventHandler],
		['authorization.error', genericEventHandler],
		['authorization.success', genericEventHandler],
		['backchannel.error', genericEventHandler],
		['backchannel.success', genericEventHandler],
		['jwks.error', genericEventHandler],
		['client_credentials.destroyed', genericEventHandler],
		['client_credentials.saved', genericEventHandler],
		['client_credentials.issued', genericEventHandler],
		['device_code.consumed', genericEventHandler],
		['device_code.destroyed', genericEventHandler],
		['device_code.saved', genericEventHandler],
		['discovery.error', genericEventHandler],
		['end_session.error', genericEventHandler],
		['end_session.success', genericEventHandler],
		['grant.error', genericEventHandler],
		['grant.revoked', genericEventHandler],
		['grant.success', genericEventHandler],
		['initial_access_token.destroyed', genericEventHandler],
		['initial_access_token.saved', genericEventHandler],
		['interaction.destroyed', genericEventHandler],
		['interaction.ended', genericEventHandler],
		['interaction.saved', genericEventHandler],
		['interaction.started', genericEventHandler],
		['introspection.error', genericEventHandler],
		['replay_detection.destroyed', genericEventHandler],
		['replay_detection.saved', genericEventHandler],
		['pushed_authorization_request.error', genericEventHandler],
		['pushed_authorization_request.success', genericEventHandler],
		['pushed_authorization_request.destroyed', genericEventHandler],
		['pushed_authorization_request.saved', genericEventHandler],
		['refresh_token.consumed', genericEventHandler],
		['refresh_token.destroyed', genericEventHandler],
		['refresh_token.saved', genericEventHandler],
		['registration_access_token.destroyed', genericEventHandler],
		['registration_access_token.saved', genericEventHandler],
		['registration_create.error', genericEventHandler],
		['registration_create.success', genericEventHandler],
		['registration_delete.error', genericEventHandler],
		['registration_delete.success', genericEventHandler],
		['registration_read.error', genericEventHandler],
		['registration_update.error', genericEventHandler],
		['registration_update.success', genericEventHandler],
		['revocation.error', genericEventHandler],
		['server_error', genericEventHandler],
		['session.destroyed', genericEventHandler],
		['session.saved', genericEventHandler],
		['userinfo.error', genericEventHandler]
	];

	eventHandlers.map(([eventName, listener]) => {
		provider.on(eventName, (...args) => {
			// we detect here when ctx arg is passed so we skip writing ctx argument when debugging,
			// since it will contain koa request, and can bloat our stdout easily
			logger.debug(...args.filter((arg) => !arg.req));
			// finally, we call our listener function that is one of the functions defined bellow
			listener(...args);
		});
	});
}

/**
 * @param  {...any} args
 */ // eslint-disable-next-line no-unused-vars
function genericEventHandler(...args) {
	// do nothing, example only
}
