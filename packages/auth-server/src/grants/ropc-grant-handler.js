import instance from 'oidc-provider/lib/helpers/weak_cache.js';

import { InvalidClient } from 'oidc-provider/lib/helpers/errors.js';
import {
	InvalidOtpGrant,
	TooManyAttempts,
	IncorrectCode,
	CodeExpired,
	UserNotFound
} from './ropc-grant-errors.js';

import createPrismaClient from '../adapter/prisma-client.js';
import TokenRepo from './ropc-repo.js';

export const gty = 'ropc-otp'; // Resource Owner Password Credentials Grant using a one time password/code
export const parameters = new Set(['scope', 'resource', 'email', 'otp']);

const tokenRepo = new TokenRepo(createPrismaClient());

/**
 * @param {import('oidc-provider').KoaContextWithOIDC} ctx
 * @param {function} next
 */
export const handler = async function (ctx, next) {
	const { client, params } = ctx.oidc;

	if (!params || !params.otp) {
		throw new InvalidOtpGrant('params missing');
	}

	if (!client) {
		throw new InvalidClient('client not set');
	}

	try {
		ctx.body = await performRopcOtpGrant(ctx);
	} catch (err) {
		if (err instanceof TooManyAttempts) {
			ctx.status = 429;
			return;
		}

		if (err instanceof IncorrectCode) {
			ctx.status = 401;
			ctx.message = 'IncorrectCode';
			return;
		}

		if (err instanceof CodeExpired) {
			ctx.status = 401;
			ctx.message = 'CodeExpired';
			return;
		}

		throw err;
	}

	await next();
};

/**
 * @param {import('oidc-provider').KoaContextWithOIDC} ctx
 * @returns {Promise<{access_token: string,	expires_in: number, token_type: string, scope: string|undefined, id_token: string|undefined}>}
 */
const performRopcOtpGrant = async (ctx) => {
	const { email, otp, scope } = ctx.oidc.params;

	const account = await findAccount(ctx, email);
	await validateToken(account, otp);
	await account.enrolUser();

	const claims = await account.claims('', scope, {}, []);
	const { accessTokenValue, accessToken } = await createAccessToken(ctx, account, claims);
	const idTokenValue = await createIdToken(ctx, claims);

	return {
		access_token: accessTokenValue,
		expires_in: accessToken.expiration,
		token_type: accessToken.tokenType,
		scope: accessToken.scope,
		id_token: idTokenValue
	};
};

/**
 * @param {import('oidc-provider').KoaContextWithOIDC} ctx
 * @param {string} email
 * @returns {Promise<import('oidc-provider').Account>}
 */
async function findAccount(ctx, email) {
	const account = await ctx.oidc.provider.Account.findAccount(ctx, email);
	if (!account) throw new UserNotFound();
	ctx.oidc.entity('Account', account);
	return account;
}

/**
 * @param {import('oidc-provider').Account} account
 * @param {string} otp
 * @returns {Promise<void>}
 */
async function validateToken(account, otp) {
	/**
	 * @param {number} minutes
	 * @param {Date} timeCreated
	 * @param {Date} timeNow
	 * @returns {boolean}
	 */
	const isTokenExpired = (minutes, timeCreated, timeNow = new Date()) => {
		return Math.ceil((timeNow - timeCreated) / 60000) > minutes;
	};

	const securityToken = await tokenRepo.getByUserId(account.accountId);
	if (!securityToken) throw new InvalidOtpGrant(`no token for account: ${account.accountId}`);
	if (securityToken?.attempts > 3) throw new TooManyAttempts();
	if (securityToken.token !== otp) throw new IncorrectCode();
	if (isTokenExpired(30, securityToken.tokenGeneratedAt)) throw new CodeExpired();
}

/**
 * @param {import('oidc-provider').KoaContextWithOIDC} ctx
 * @param {import('oidc-provider').Account} account
 * @param {import('oidc-provider').UnknownObject} claims
 * @returns {Promise<{accessTokenValue: string, accessToken: ReturnType<typeof import('oidc-provider/lib/models/access_token.js')>}>}
 */
async function createAccessToken(ctx, account, claims) {
	const {
		features: { resourceIndicators }
	} = instance(ctx.oidc.provider).configuration();

	const { client } = ctx.oidc;
	if (!client) throw new InvalidClient('client not found');

	const { resource, scope } = ctx.oidc.params;
	const scopes = scope.split(' ');

	const grant = new ctx.oidc.provider.Grant({
		accountId: ctx.oidc.account.accountId,
		clientId: ctx.oidc.client.clientId
	});
	grant.openid = {
		scope: scope,
		claims: Object.keys(claims)
	};
	ctx.oidc.entity('Grant', grant);
	await grant.save();

	const { AccessToken } = ctx.oidc.provider;
	const accessToken = new AccessToken({
		gty,
		accountId: account.accountId,
		clientId: client.clientId,
		client: client,
		grantId: grant.jti,
		scope: scope
	});

	if (resource) {
		const resourceServerInfo = await resourceIndicators.getResourceServerInfo(
			ctx,
			resource,
			ctx.oidc.client
		);

		accessToken.resourceServer = new ctx.oidc.provider.ResourceServer(resource, resourceServerInfo);
		// accessToken.scope = grant.getResourceScopeFiltered(resource, scopes);
		accessToken.scope = scope;
	} else {
		accessToken.claims = {
			userinfo: Object.fromEntries(Object.entries(claims).map(([key]) => [key, null]))
		}; // these get filtered out if not null, should these be retrieved from somewhere else
		accessToken.scope = grant.getOIDCScopeFiltered(scopes);
	}

	ctx.oidc.entity('AccessToken', accessToken);
	const accessTokenValue = await accessToken.save();

	return { accessTokenValue, accessToken };
}

/**
 * @param {import('oidc-provider').KoaContextWithOIDC} ctx
 * @param {import('oidc-provider').UnknownObject} claims
 * @returns {Promise<string|undefined>}
 */
async function createIdToken(ctx, claims) {
	const { scope } = ctx.oidc.params;
	const scopes = scope.split(' ');

	if (scopes.includes('openid')) {
		const { IdToken } = ctx.oidc.provider;

		const id = new IdToken(claims, { ctx });

		if (id.available) {
			Object.entries(id.available).forEach(([key, value]) => {
				if (scopes.includes(key) || key === 'sub') {
					id.set(key, value);
				}
			});
		}

		return await id.issue({ use: 'idtoken' });
	}
}
