import { InvalidGrant } from 'oidc-provider/lib/helpers/errors.js';

export class InvalidOtpGrant extends InvalidGrant {
	constructor(detail) {
		super('invalid_otp_grant');
		Object.assign(this, { error_description: detail, error_detail: detail });
	}
}

export class TooManyAttempts extends InvalidGrant {
	constructor(detail) {
		super('too_many_attempts');
		Object.assign(this, { error_description: detail, error_detail: detail });
	}
}

export class IncorrectCode extends InvalidGrant {
	constructor(detail) {
		super('incorrect_code');
		Object.assign(this, { error_description: detail, error_detail: detail });
	}
}

export class CodeExpired extends InvalidGrant {
	constructor(detail) {
		super('code_expired');
		Object.assign(this, { error_description: detail, error_detail: detail });
	}
}

export class UserNotFound extends InvalidGrant {
	constructor(detail) {
		super('user_not_found');
		Object.assign(this, { error_description: detail, error_detail: detail });
	}
}
