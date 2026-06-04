const fetchMock = require('jest-fetch-mock');
const { default: fetch } = require('node-fetch');
const { DocumentsApiClient } = require('./documents-api-client');

const mockLogger = jest.fn();

jest.mock('../../src/lib/logger', () => ({
	child: () => ({
		debug: mockLogger,
		error: mockLogger,
		warn: mockLogger
	})
}));

class TestApiClient extends DocumentsApiClient {
	/**
	 * @param {string} baseUrl - e.g. https://example.com
	 * @param {number} [timeout] - timeout in ms defaults to 1000 (ms)
	 */
	constructor(baseUrl, timeout) {
		super(baseUrl, undefined, timeout);
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
const apiClient = new TestApiClient(TEST_BASEURL, 500);
const v2 = '/api/v2';

describe('documents-api-client', () => {
	beforeEach(() => {
		fetch.resetMocks();
		fetch.doMock();
	});

	afterEach(() => {});

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

	describe('getBulkDocumentsDownloadByType', () => {
		it('should get bulk documents download by type', async () => {
			fetch.mockResponseOnce(JSON.stringify({ a: 1 }));
			const ref = 'ref123';
			const path = 'path';
			const filter = 'filter1';

			await apiClient.getBulkDocumentsDownloadByType(ref, path, filter);

			expect(fetch).toHaveBeenCalledWith(
				`${TEST_BASEURL}${v2}/${path}/${ref}/document-type?filter=${filter}`,
				expect.objectContaining({
					method: 'GET'
				})
			);
		});
	});
});
