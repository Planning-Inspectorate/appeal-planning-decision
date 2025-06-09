const { isTokenValid } = require('../../../src/lib/is-token-valid');
const { getAuthClientConfig, createROPCGrant } = require('@pins/common/src/client/auth-client');

jest.mock('@pins/common/src/client/auth-client');

const code = '63654';
const email = 'test@example.com';

describe('lib/is-token-valid', () => {
	beforeAll(() => {
		jest.useFakeTimers();
		jest.setSystemTime(new Date('2025-06-09T12:00:00Z'));
	});

	afterAll(() => {
		jest.useRealTimers();
	});

	beforeEach(() => {
		jest.resetAllMocks();
	});

	describe('isTokenValid', () => {
		it('should return false without calling getAuthClientConfig if emailAddress parameter is missing', async () => {
			const result = await isTokenValid(code);
			expect(result.valid).toBe(false);
			expect(getAuthClientConfig).not.toHaveBeenCalled();
		});

		it('should return false without calling getAuthClient if code parameter is missing', async () => {
			const result = await isTokenValid(undefined);
			expect(result.valid).toBe(false);
			expect(getAuthClientConfig).not.toHaveBeenCalled();
		});

		it('should return result of getAuthToken', async () => {
			const action = 'testAction';
			const date = new Date();
			const expiresIn = 3600;

			createROPCGrant.mockResolvedValue({
				access_token: 'access_token',
				id_token: 'id_token',
				expires_in: expiresIn
			});

			const result = await isTokenValid(code, email, action);
			expect(result).toEqual({
				access_token: 'access_token',
				access_token_expiry: new Date(date.getTime() + expiresIn * 1000),
				action: action,
				id_token: 'id_token',
				valid: true
			});
		});

		it('should return throw unhandled error', async () => {
			const errorMessage = 'error';
			createROPCGrant.mockRejectedValueOnce(new Error(errorMessage));

			expect(async () => await isTokenValid(code, email)).rejects.toThrow(errorMessage);
		});

		it('should return tooManyAttempts error', async () => {
			const error = new Error('error');
			error.response = {
				statusCode: 429
			};

			createROPCGrant.mockRejectedValueOnce(error);

			const result = await isTokenValid(code, email);
			expect(result.valid).toEqual(false);
			expect(result.tooManyAttempts).toEqual(true);
		});

		it('should return expired error', async () => {
			const error = new Error('error');
			error.response = {
				statusMessage: 'CodeExpired'
			};

			createROPCGrant.mockRejectedValueOnce(error);

			const result = await isTokenValid(code, email);
			expect(result.valid).toEqual(false);
			expect(result.expired).toEqual(true);
		});

		it('should return invalid code error', async () => {
			const error = new Error('error');
			error.response = {
				statusMessage: 'IncorrectCode'
			};

			createROPCGrant.mockRejectedValueOnce(error);

			const result = await isTokenValid(code, email);
			expect(result.valid).toEqual(false);
		});
	});
});
