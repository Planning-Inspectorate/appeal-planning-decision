const fetchMock = require('jest-fetch-mock');
const { default: fetch } = require('node-fetch');
const { AppealsApiClient, AppealsApiError } = require('./appeals-api-client');

const mockLogger = jest.fn();

jest.mock('../../src/lib/logger', () => ({
	child: () => ({
		debug: mockLogger,
		error: mockLogger,
		warn: mockLogger
	})
}));

class TestApiClient extends AppealsApiClient {
	/**
	 * @param {string} baseUrl - e.g. https://example.com
	 * @param {number} [timeout] - timeout in ms defaults to 1000 (ms)
	 */
	constructor(baseUrl, timeout) {
		super(baseUrl, timeout);
	}

	/**
	 * @param {string} endpoint
	 * @returns
	 */
	async makeTestRequest(endpoint) {
		return await this.handler(endpoint);
	}
}

const TEST_BASEURL = 'https://example.com';
const TEST_EMAIL = 'test@example.com';
const apiClient = new TestApiClient(TEST_BASEURL, 500);
const v2 = '/api/v2';

describe('appeals-api-client', () => {
	beforeEach(() => {
		fetch.resetMocks();
		fetch.doMock();
		// jest.useFakeTimers();
	});

	afterEach(() => {
		// jest.useRealTimers();
	});

	describe('handler', () => {
		it('should send content type header', async () => {
			fetch.mockResponseOnce(JSON.stringify({ a: 1 }));
			await apiClient.makeTestRequest('/test');
			expect(fetch).toHaveBeenCalledWith(
				`${TEST_BASEURL}/test`,
				expect.objectContaining({
					headers: expect.objectContaining({
						'Content-Type': 'application/json'
					})
				})
			);
		});

		it('should handle timeout', async () => {
			fetch.mockOnce(async () => {
				await new Promise((resolve) => setTimeout(resolve, 50));
			});
			const testClient = new TestApiClient(TEST_BASEURL, 1);
			await expect(testClient.makeTestRequest('/test')).rejects.toThrow(
				'The operation was aborted. '
			);
		});

		it('should handle fetch error', async () => {
			fetch.mockOnce(async () => {
				throw new Error('fetch error');
			});
			await expect(apiClient.makeTestRequest('/test')).rejects.toThrow('fetch error');
		});

		it('should handle no content type from server', async () => {
			const errorVal = 'abc';
			fetchMock.mockResponseOnce(JSON.stringify({ a: 1 }), {
				status: 400,
				statusText: errorVal,
				headers: {
					'content-type': ''
				}
			});

			await expect(apiClient.makeTestRequest('/test')).rejects.toThrow(errorVal);
		});

		it('should handle text error response', async () => {
			const errorVal = 'abc';
			fetchMock.mockResponseOnce(errorVal, {
				status: 500,
				statusText: 'Internal Server Error',
				headers: {
					'content-type': 'text/plain'
				}
			});

			await expect(apiClient.makeTestRequest('/test')).rejects.toThrow(errorVal);
		});

		it('should handle bad error json response', async () => {
			const errorVal = 'Internal Server Error';
			fetchMock.mockResponseOnce('{ whoops: }', {
				status: 400,
				statusText: errorVal,
				headers: {
					'content-type': 'application/json;'
				}
			});

			await expect(apiClient.makeTestRequest('/test')).rejects.toThrow(errorVal);
		});

		it('should handle known error json response', async () => {
			const errorVal = 'message';
			const errors = ['nope', 'no'];
			fetchMock.mockResponseOnce(JSON.stringify(errors), {
				status: 400,
				statusText: errorVal,
				headers: {
					'content-type': 'application/json;'
				}
			});

			try {
				await apiClient.makeTestRequest('/test');
			} catch (err) {
				if (!(err instanceof AppealsApiError)) {
					throw new Error("didn't throw AppealsApiError");
				}

				expect(err.message).toBe(errorVal);
				expect(err.code).toBe(400);
				expect(err.errors).toEqual(errors);
				return;
			}

			throw new Error("didn't throw");
		});

		it('should handle unknown error json response', async () => {
			const errorVal = 'message';
			const errors = { a: 1 };
			fetchMock.mockResponseOnce(JSON.stringify(errors), {
				status: 400,
				statusText: errorVal,
				headers: {
					'content-type': 'application/json;'
				}
			});

			await expect(apiClient.makeTestRequest('/test')).rejects.toThrow(errorVal);
		});
	});

	describe('getUserByEmailV2', () => {
		it('should get user by email (v2)', async () => {
			fetch.mockResponseOnce(JSON.stringify({ a: 1 }));
			const createResponse = await apiClient.getUserByEmailV2(TEST_EMAIL);

			expect(fetch).toHaveBeenCalledWith(
				`${TEST_BASEURL}${v2}/users/${TEST_EMAIL}`,
				expect.objectContaining({
					method: 'GET'
				})
			);
			expect(createResponse).toEqual({ a: 1 });
		});
	});

	describe('linkUserToV2Appeal', () => {
		it('should handle no role', async () => {
			const testId = 'abc';
			fetch.mockResponseOnce(JSON.stringify({ a: 1 }));
			const createResponse = await apiClient.linkUserToV2Appeal(TEST_EMAIL, testId);

			expect(fetch).toHaveBeenCalledWith(
				`${TEST_BASEURL}${v2}/users/${TEST_EMAIL}/appeal/${testId}`,
				expect.objectContaining({
					method: 'POST'
				})
			);
			expect(createResponse).toEqual({ a: 1 });
		});

		it('should handle role', async () => {
			const testId = 'abc';
			const role = 'agent';
			fetch.mockResponseOnce(JSON.stringify({ a: 1 }));
			const createResponse = await apiClient.linkUserToV2Appeal(TEST_EMAIL, testId, role);

			expect(fetch).toHaveBeenCalledWith(
				`${TEST_BASEURL}${v2}/users/${TEST_EMAIL}/appeal/${testId}`,
				expect.objectContaining({
					method: 'POST',
					body: JSON.stringify({ role: role })
				})
			);
			expect(createResponse).toEqual({ a: 1 });
		});
	});
});
