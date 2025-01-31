import { UnknownUserId } from 'oidc-provider/lib/helpers/errors.js';
import { isEmailLike } from '../validators/email.js';

/** @type {import('./repository.js').default} */
let repo;
/** @type {import('../lib/notify.js').default} */
let notify;

class Account {
	/**
	 * @param {string} id
	 * @param {import("@prisma/client").AppealUser} user
	 */
	constructor(id, user) {
		user.email = user.email?.trim();
		this.accountId = id;
		this.user = user;
	}

	async enrolUser() {
		if (
			!this.user.isEnrolled && // don't resend
			!this.user.isLpaUser // don't send appellant email to lpa users
		) {
			this.user.isEnrolled = true;
			await repo.updateUser(this.user);
			await notify.sendConfirmRegistrationEmailToAppellant(this.user.email, this.accountId);
		}
	}

	/**
	 * get claims for the account/user - a claim is a piece of information about that user that the client has requested access to
	 * @param {"idtoken"|"userinfo"} use depending on where the specific claims are intended to be put in
	 * @param {string} scope the intended scope, while oidc-provider will mask claims depending on the
	 *   scope automatically you might want to skip loading some claims from external resources etc.
	 *   based on this detail or not return them in id tokens but only userinfo and so on.
	 * @param {{ [key: string]: null | import('oidc-provider').ClaimsParameterMember}} claims
	 *   the part of the claims authorization parameter for either "id_token" or "userinfo" ("use" param)
	 * @param {string[]} rejected claim names that were rejected by the end-user, you might want to skip
	 *   loading some claims from external resources or through db projection
	 * @returns {Promise<import('oidc-provider').UnknownObject>}
	 */ // eslint-disable-next-line no-unused-vars
	async claims(use, scope, claims, rejected) {
		const details = {
			sub: this.accountId, // it is essential to always return a sub claim
			email: this.user.email
		};

		if (this.user.isLpaUser) {
			details.lpaCode = this.user.lpaCode;
			details.isLpaAdmin = this.user.isLpaAdmin;
			details.lpaStatus = this.user.lpaStatus;
		}

		return details;

		// if additional db lookups are required for some scope requests,
		// can add them here so db call only made when requested
		//if(scope...)
	}

	/**
	 * @param {import('oidc-provider').KoaContextWithOIDC} ctx
	 * @param {string} id
	 * @returns {Promise<Account>}
	 */ // eslint-disable-next-line no-unused-vars
	static async findAccount(ctx, id, token) {
		let user;

		if (isEmailLike(id)) {
			id = id.trim();
			user = await repo.getByEmail(id);
		} else {
			user = await repo.getById(id);
		}

		if (!user) throw new UnknownUserId(id);

		return new Account(user.id, user);
	}

	/**
	 * @param {import('../dependencies.js').allDependencies} dependencies
	 */
	static setDependencies(dependencies) {
		repo = dependencies.accountRepo;
		notify = dependencies.notify;
	}
}

export default Account;
