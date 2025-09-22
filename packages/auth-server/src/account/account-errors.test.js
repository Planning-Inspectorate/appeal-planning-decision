import { DuplicateAccount } from './account-errors.js';

describe('DuplicateAccount error', () => {
	it('sets proper oidc error fields', () => {
		const err = new DuplicateAccount('duplicate user test@example.com');
		expect(err.error).toBe('invalid_request');
		expect(err.error_description).toBe('duplicate user test@example.com');
		expect(err.error_detail).toBe('duplicate user test@example.com');
	});
});
