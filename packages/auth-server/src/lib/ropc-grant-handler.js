import { InvalidGrant, InvalidClient, InvalidToken } from 'oidc-provider/lib/helpers/errors.js';
import instance from 'oidc-provider/lib/helpers/weak_cache.js';

export const gty = 'ropc-otp'; // Resource Owner Password Credentials Grant using a one time password/code

/**
 * @param {import('oidc-provider').KoaContextWithOIDC} ctx
 * @param {string} username
 * @param {string} otp
 * @param {string} resource
 * @returns {Promise<TokenResponseBody>}
 */
const performRopcOtpGrant = async (ctx, username, otp, resource) => {
	const {
		features: { resourceIndicators }
	} = instance(ctx.oidc.provider).configuration();

	const { client } = ctx.oidc;
	if (!client) {
		throw new InvalidClient('client not found');
	}

	const scope = ctx.oidc.params.scope || ''; // todo limit based on resource

	let account;
	try {
		account = {
			accountId: '1234567890', // userId
			claims: async () => {
				return {
					sub: '1234567890',
					name: 'John Doe',
					email: 'bryn.thomas@planninginspectorate.gov.uk'
				};
			}
		}; //await authenticate(username, otp); // todo lookup user
	} catch (err) {
		throw new InvalidToken('invalid credentials provided');
	}
	const claims = await account.claims();
	const resourceServerInfo = await resourceIndicators.getResourceServerInfo(
		ctx,
		resource,
		ctx.oidc.client
	);

	const { AccessToken, IdToken } = ctx.oidc.provider; //RefreshToken

	const at = new AccessToken({
		gty,
		accountId: account.accountId,
		clientId: client.clientId,
		client: client,
		grantId: ctx.uid,
		scope: scope,
		resourceServer: new ctx.oidc.provider.ResourceServer(resource, resourceServerInfo)
	});
	const expiresIn = at.expiration;

	// ctx.oidc.entity('AccessToken', at);
	const accessTokenValue = await at.save();

	// const refreshToken = new RefreshToken({
	// 	accountId: account.accountId,
	// 	clientId: client.clientId,
	// 	client: client,
	// 	grantId: ctx.uid,
	// 	scope: scope,
	// 	resourceServer: new ctx.oidc.provider.ResourceServer(resource, resourceServerInfo),
	// 	claims: {
	// 		id_token: { sub: { value: account.accountId } }
	// 	}
	// });
	// // ctx.oidc.entity('RefreshToken', refreshToken);
	// const refreshTokenValue = await refreshToken.save();

	const id = new IdToken(claims, { ctx });
	id.set('at_hash', accessTokenValue);
	// id.set('rt_hash', refreshTokenValue);
	id.set('sub', account.accountId);
	id.set('name', claims.name);
	id.set('email', claims.email);
	const idTokenValue = await id.issue({ use: 'idtoken' });

	return {
		access_token: accessTokenValue,
		id_token: idTokenValue,
		// refresh_token: refreshTokenValue,
		expires_in: expiresIn
		// token_type: 'Bearer',
	};
};

/**
 * @param {import('oidc-provider').KoaContextWithOIDC} ctx
 * @param {function} next
 */
export const handler = async function (ctx, next) {
	const { client, params } = ctx.oidc;

	if (!params || !params.username || !params.otp) {
		throw new InvalidOtpGrant('params missing');
	}

	if (!client) {
		throw new InvalidClient('client not set');
	}

	ctx.body = await performRopcOtpGrant(ctx, params.username, params.otp, params.resource);

	await next();
};

export const parameters = new Set(['scope', 'resource', 'username', 'otp', 'name']);

/**
 * @class Otp Grant Errors
 */
export class InvalidOtpGrant extends InvalidGrant {
	constructor(detail) {
		super('invalid_password_grant');
		Object.assign(this, { error_description: detail, error_detail: detail });
	}
}
