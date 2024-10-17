const { isTokenValid } = require('../../../src/lib/is-token-valid');
const { getAuthClient } = require('@pins/common/src/client/auth-client');

jest.mock('@pins/common/src/client/auth-client');
const mockGrant = jest.fn();

const code = '63654';
const email = 'test@example.com';

describe('lib/is-token-valid', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	describe('isTokenValid', () => {
		it('should return false without calling getAuthClient if emailAddress parameter is missing', async () => {
			const result = await isTokenValid(code);
			expect(result.valid).toBe(false);
			expect(getAuthClient).not.toBeCalled();
		});

		it('should return false without calling getAuthClient if code parameter is missing', async () => {
			const result = await isTokenValid(undefined);
			expect(result.valid).toBe(false);
			expect(getAuthClient).not.toBeCalled();
		});

		it('should return result of getAuthToken', async () => {
			const action = 'testAction';
			const date = new Date();
			mockGrant.mockResolvedValue({
				access_token: 'access_token',
				id_token: 'id_token',
				expires_at: date.getTime() / 1000
			});
			getAuthClient.mockResolvedValue({ grant: mockGrant });

			const result = await isTokenValid(code, email, action);
			expect(result).toEqual({
				access_token: 'access_token',
				access_token_expiry: date,
				action: action,
				id_token: 'id_token',
				valid: true
			});
		});

		it('should return throw unhandled error', async () => {
			const errorMessage = 'error';
			mockGrant.mockRejectedValueOnce(new Error(errorMessage));
			getAuthClient.mockResolvedValue({ grant: mockGrant });

			expect(async () => await isTokenValid(code, email)).rejects.toThrow(errorMessage);
		});

		it('should return tooManyAttempts error', async () => {
			const error = new Error('error');
			error.response = {
				statusCode: 429
			};

			mockGrant.mockRejectedValueOnce(error);
			getAuthClient.mockResolvedValue({ grant: mockGrant });

			const result = await isTokenValid(code, email);
			expect(result.valid).toEqual(false);
			expect(result.tooManyAttempts).toEqual(true);
		});

		it('should return expired error', async () => {
			const error = new Error('error');
			error.response = {
				statusMessage: 'CodeExpired'
			};

			mockGrant.mockRejectedValueOnce(error);
			getAuthClient.mockResolvedValue({ grant: mockGrant });

			const result = await isTokenValid(code, email);
			expect(result.valid).toEqual(false);
			expect(result.expired).toEqual(true);
		});

		it('should return invalid code error', async () => {
			const error = new Error('error');
			error.response = {
				statusMessage: 'IncorrectCode'
			};

			mockGrant.mockRejectedValueOnce(error);
			getAuthClient.mockResolvedValue({ grant: mockGrant });

			const result = await isTokenValid(code, email);
			expect(result.valid).toEqual(false);
		});
	});
});
