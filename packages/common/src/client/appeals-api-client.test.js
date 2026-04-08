const fetchMock = require('jest-fetch-mock');
const { default: fetch } = require('node-fetch');
const { AppealsApiClient, ApiClientError } = require('./appeals-api-client');
const { APPEAL_USER_ROLES, REPRESENTATION_TYPES } = require('../constants');

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
				if (!(err instanceof ApiClientError)) {
					throw new Error("didn't throw ApiClientError");
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
				`${TEST_BASEURL}${v2}/users/${encodeURIComponent(TEST_EMAIL)}`,
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
				`${TEST_BASEURL}${v2}/users/${encodeURIComponent(TEST_EMAIL)}/appeal/${testId}`,
				expect.objectContaining({
					method: 'POST'
				})
			);
			expect(createResponse).toEqual({ a: 1 });
		});

		it('should handle role', async () => {
			const testId = 'abc';
			const role = APPEAL_USER_ROLES.AGENT;
			fetch.mockResponseOnce(JSON.stringify({ a: 1 }));
			const createResponse = await apiClient.linkUserToV2Appeal(TEST_EMAIL, testId, role);

			expect(fetch).toHaveBeenCalledWith(
				`${TEST_BASEURL}${v2}/users/${encodeURIComponent(TEST_EMAIL)}/appeal/${testId}`,
				expect.objectContaining({
					method: 'POST',
					body: JSON.stringify({ role: role })
				})
			);
			expect(createResponse).toEqual({ a: 1 });
		});
	});

	describe('getDocumentDetails', () => {
		it('should get document details by id', async () => {
			const testId = 'abc';
			fetch.mockResponseOnce(JSON.stringify({ a: 1 }));
			const createResponse = await apiClient.getDocumentDetails(testId);

			expect(fetch).toHaveBeenCalledWith(
				`${TEST_BASEURL}${v2}/documents/${testId}`,
				expect.objectContaining({
					method: 'GET'
				})
			);
			expect(createResponse).toEqual({ a: 1 });
		});
	});

	describe('getAppealCaseByCaseRef', () => {
		it('should get appeal case by case reference without selectFields', async () => {
			const testCaseRef = '6000000';
			const mockResponse = {
				id: '123',
				caseRef: testCaseRef,
				status: 'in_progress'
			};
			fetch.mockResponseOnce(JSON.stringify(mockResponse));
			const response = await apiClient.getAppealCaseByCaseRef(testCaseRef);

			expect(fetch).toHaveBeenCalledWith(
				`${TEST_BASEURL}${v2}/appeal-cases/${testCaseRef}?`,
				expect.objectContaining({
					method: 'GET'
				})
			);
			expect(response).toEqual(mockResponse);
		});

		it('should get appeal case with selectFields parameter', async () => {
			const testCaseRef = '1010107';
			const selectFields = {
				caseReference: true,
				appealTypeCode: true,
				LPACode: true,
				caseProcedure: true,
				caseStatus: true
			};
			const mockResponse = {
				caseReference: testCaseRef,
				appealTypeCode: 'S78',
				LPACode: 'E09000033',
				caseProcedure: 'Written',
				caseStatus: 'issue_decision'
			};
			fetch.mockResponseOnce(JSON.stringify(mockResponse));
			const response = await apiClient.getAppealCaseByCaseRef(testCaseRef, selectFields);

			// URLSearchParams handles the encoding automatically
			const urlParams = new URLSearchParams();
			urlParams.append('fields', JSON.stringify(selectFields));
			const expectedUrl = `${TEST_BASEURL}${v2}/appeal-cases/${testCaseRef}?${urlParams.toString()}`;

			expect(fetch).toHaveBeenCalledWith(
				expectedUrl,
				expect.objectContaining({
					method: 'GET'
				})
			);
			expect(response).toEqual(mockResponse);
		});

		it('should encode special characters in case reference', async () => {
			const testCaseRef = '6000000/1';
			const mockResponse = { id: '123', caseRef: testCaseRef };
			fetch.mockResponseOnce(JSON.stringify(mockResponse));
			const response = await apiClient.getAppealCaseByCaseRef(testCaseRef);

			expect(fetch).toHaveBeenCalledWith(
				`${TEST_BASEURL}${v2}/appeal-cases/6000000%2F1?`,
				expect.objectContaining({
					method: 'GET'
				})
			);
			expect(response).toEqual(mockResponse);
		});

		it('should handle complex selectFields with nested Prisma select', async () => {
			const testCaseRef = '1010107';
			const selectFields = {
				caseReference: true,
				Documents: {
					select: {
						id: true,
						filename: true,
						documentType: true
					},
					where: {
						documentType: 'caseDecisionLetter'
					}
				},
				Events: {
					select: {
						type: true,
						startDate: true
					}
				}
			};
			const mockResponse = { caseReference: testCaseRef };
			fetch.mockResponseOnce(JSON.stringify(mockResponse));
			const response = await apiClient.getAppealCaseByCaseRef(testCaseRef, selectFields);

			// URLSearchParams handles the encoding
			const urlParams = new URLSearchParams();
			urlParams.append('fields', JSON.stringify(selectFields));
			const expectedUrl = `${TEST_BASEURL}${v2}/appeal-cases/${testCaseRef}?${urlParams.toString()}`;

			expect(fetch).toHaveBeenCalledWith(
				expectedUrl,
				expect.objectContaining({
					method: 'GET'
				})
			);
			expect(response).toEqual(mockResponse);
		});

		it('should handle empty selectFields object', async () => {
			const testCaseRef = '6000000';
			const selectFields = {};
			const mockResponse = { id: '123', caseRef: testCaseRef };
			fetch.mockResponseOnce(JSON.stringify(mockResponse));
			const response = await apiClient.getAppealCaseByCaseRef(testCaseRef, selectFields);

			const urlParams = new URLSearchParams();
			urlParams.append('fields', JSON.stringify(selectFields));
			const expectedUrl = `${TEST_BASEURL}${v2}/appeal-cases/${testCaseRef}?${urlParams.toString()}`;

			expect(fetch).toHaveBeenCalledWith(
				expectedUrl,
				expect.objectContaining({
					method: 'GET'
				})
			);
			expect(response).toEqual(mockResponse);
		});

		it('should throw when not found', async () => {
			const testCaseRef = 'APP-NOTFOUND';
			fetchMock.mockResponseOnce(JSON.stringify({ message: 'Not found' }), {
				status: 404,
				statusText: 'Not Found',
				headers: { 'content-type': 'application/json' }
			});

			await expect(apiClient.getAppealCaseByCaseRef(testCaseRef)).rejects.toThrow();
		});
	});

	describe('getAppealCaseWithRepresentations', () => {
		it('should get document details by id', async () => {
			const testCaseReference = 'abc';
			fetch.mockResponseOnce(JSON.stringify({ a: 1 }));
			const createResponse = await apiClient.getAppealCaseWithRepresentations(testCaseReference);

			expect(fetch).toHaveBeenCalledWith(
				`${TEST_BASEURL}${v2}/appeal-cases/${testCaseReference}/representations`,
				expect.objectContaining({
					method: 'GET'
				})
			);
			expect(createResponse).toEqual({ a: 1 });
		});
	});

	describe('getAppealCaseWithRepresentationsByType', () => {
		it('should handle type', async () => {
			const testCaseReference = 'abc';
			const type = REPRESENTATION_TYPES.STATEMENT;
			fetch.mockResponseOnce(JSON.stringify({ a: 1 }));
			const createResponse = await apiClient.getAppealCaseWithRepresentationsByType(
				testCaseReference,
				type
			);

			expect(fetch).toHaveBeenCalledWith(
				`${TEST_BASEURL}${v2}/appeal-cases/${testCaseReference}/representations?type=${type}`,
				expect.objectContaining({
					method: 'GET'
				})
			);
			expect(createResponse).toEqual({ a: 1 });
		});
	});
});
