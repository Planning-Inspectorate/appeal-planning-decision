import { InvalidClient, UnknownUserId } from 'oidc-provider/lib/helpers/errors.js';

import config from '../configuration/config.js';
import { InvalidOtpGrant } from './custom-grant-errors.js';
import { sendSecurityCodeEmail } from '../lib/notify.js';
import createPrismaClient from '../adapter/prisma-client.js';
import { TokenRepository } from './token-repo.js';
import UserRepository from '../account/repository.js';
import { isEmailLike } from '../validators/email.js';

export const gty = 'otp'; // create and send a one time password
export const parameters = new Set(['resource', 'email', 'action']);

const tokenRepo = new TokenRepository(createPrismaClient());
const userRepo = new UserRepository();

/**
 * @param {import('oidc-provider').KoaContextWithOIDC} ctx
 * @param {function} next
 */
export const handler = async function (ctx, next) {
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

	ctx.body = await performOtpGrant(ctx);

	await next();
};

/**
 * @param {import('oidc-provider').KoaContextWithOIDC} ctx
 * @returns {Promise<{expires_at: number}>}
 */
const performOtpGrant = async (ctx) => {
	const { email, action } = ctx.oidc.params;

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
		const user = await userRepo.createUser({
			email: email.trim(),
			isEnrolled: false
		});

		accountId = user.id;
	}

	const token = await tokenRepo.createOrUpdate(accountId, action);

	if (token) {
		await sendSecurityCodeEmail(email, token, accountId);
	}

	return {
		expires_in: config.server.tokenExpiry
	};
};
