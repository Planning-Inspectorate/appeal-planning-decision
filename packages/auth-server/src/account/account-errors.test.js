import { InvalidRequest } from 'oidc-provider/lib/helpers/errors.js';
import { DuplicateAccount } from './account-errors';

describe('DuplicateAccount', () => {
	it('should extend InvalidRequest', () => {
		const detail = 'Account already exists';
		const error = new DuplicateAccount(detail);

		expect(error).toBeInstanceOf(InvalidRequest);
	});

	it('should set the correct error properties', () => {
		const detail = 'Account already exists';
		const error = new DuplicateAccount(detail);

		expect(error.message).toBe('invalid_request');
		expect(error.error_description).toBe(detail);
		expect(error.error_detail).toBe(detail);
	});
});
