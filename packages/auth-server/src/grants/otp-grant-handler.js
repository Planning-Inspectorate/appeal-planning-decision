import { InvalidClient, UnknownUserId } from 'oidc-provider/lib/helpers/errors.js';

import config from '../configuration/config.js';
import { InvalidOtpGrant } from './custom-grant-errors.js';
import { isEmailLike } from '../validators/email.js';

export const parameters = new Set(['resource', 'email', 'action']);

/**
 * @param {import('../dependencies.js').lifetimeDependencies} dependencies
 */
export const handler = (dependencies) => {
	/**
	 * @param {import('oidc-provider').KoaContextWithOIDC} ctx
	 * @param {function} next
	 */
	return async function (ctx, next) {
		const { client, params } = ctx.oidc;

		if (!params || !params.email) {
			throw new InvalidOtpGrant('params missing');
		}

		if (!isEmailLike(params.email)) {
			throw new InvalidOtpGrant('invalid email format');
		}

		if (!client) {
			throw new InvalidClient('client not set');
		}

		ctx.body = await performOtpGrant(ctx, dependencies);

		await next();
	};
};

/**
 * @param {import('oidc-provider').KoaContextWithOIDC} ctx
 * @param {import('../dependencies.js').lifetimeDependencies} dependencies
 * @returns {Promise<{expires_at: number}>}
 */
const performOtpGrant = async (ctx, dependencies) => {
	const { email, action } = ctx.oidc.params;

	const { accountRepo, tokenRepo } = dependencies;

	let accountId;
	try {
		const account = await ctx.oidc.provider.Account.findAccount(ctx, email);
		accountId = account?.accountId;
	} catch (err) {
		// ignore UnknownUserId as we will create one if it doesn't exist
		if (!(err instanceof UnknownUserId)) {
			throw err;
		}

		// unfortunately seem unable to use ctx.oidc.provider.Account here
		const user = await accountRepo.createUser({
			email: email.trim(),
			isEnrolled: false
		});

		accountId = user.id;
	}

	const token = await tokenRepo.createOrUpdate(accountId, action);

	if (token) {
		if (!ctx.req.dependencies?.notify) throw new InvalidOtpGrant('notify dependency not available');
		await ctx.req.dependencies.notify.sendSecurityCodeEmail(email, token, accountId);
	}

	return {
		expires_in: config.server.tokenExpiry
	};
};
