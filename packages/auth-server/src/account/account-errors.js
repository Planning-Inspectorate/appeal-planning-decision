import { InvalidRequest } from 'oidc-provider/lib/helpers/errors.js';

export class DuplicateAccount extends InvalidRequest {
	constructor(detail) {
		super('duplicate_account');
		Object.assign(this, { error_description: detail, error_detail: detail });
	}
}
