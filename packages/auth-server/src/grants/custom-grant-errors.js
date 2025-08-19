import { OIDCProviderError } from 'oidc-provider/lib/helpers/errors.js';

export class InvalidRopcGrant extends OIDCProviderError {
	constructor(detail) {
		super(400, 'invalid_ropc_grant');
		Object.assign(this, { error_detail: detail });
	}
}

export class InvalidOtpGrant extends OIDCProviderError {
	constructor(detail) {
		super(400, 'invalid_otp_grant');
		Object.assign(this, { error_detail: detail });
	}
}

export class TooManyAttempts extends OIDCProviderError {
	constructor(detail) {
		super(429, 'too_many_attempts');
		Object.assign(this, { error_detail: detail });
	}
}

export class IncorrectCode extends OIDCProviderError {
	constructor(detail) {
		super(401, 'incorrect_code');
		Object.assign(this, { error_detail: detail });
	}
}

export class CodeExpired extends OIDCProviderError {
	constructor(detail) {
		super(401, 'code_expired');
		Object.assign(this, { error_detail: detail });
	}
}

export class UserNotFound extends OIDCProviderError {
	constructor(detail) {
		super(404, 'user_not_found');
		Object.assign(this, { error_detail: detail });
	}
}
