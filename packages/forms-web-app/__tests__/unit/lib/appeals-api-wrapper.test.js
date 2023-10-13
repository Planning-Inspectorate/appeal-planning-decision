jest.mock('uuid');

const fetch = require('node-fetch');
const uuid = require('uuid');
const {
	createOrUpdateAppeal,
	getExistingAppeal,
	getLPAList,
	getLPA,
	saveAppeal,
	createUser,
	getUserById,
	getUserByEmail,
	getUsers,
	removeUser
} = require('../../../src/lib/appeals-api-wrapper');

const config = require('../../../src/config');

const mockLogger = jest.fn();

jest.mock('../../../src/lib/logger', () => ({
	child: () => ({
		debug: mockLogger,
		error: mockLogger,
		warn: mockLogger
	})
}));

config.appeals.url = 'http://fake.url';

describe('lib/appeals-api-wrapper', () => {
	beforeEach(() => {
		fetch.resetMocks();
		fetch.doMock();
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	describe('createOrUpdateAppeal', () => {
		[
			{
				title: 'POST when a id is missing',
				given: () => {
					fetch.mockResponseOnce(JSON.stringify({ good: 'data' }));

					return {
						a: 'b',
						id: undefined
					};
				},
				expected: (appealsApiResponse) => {
					expect(fetch).toHaveBeenCalledWith(`${config.appeals.url}/api/v1/appeals`, {
						body: '{"a":"b"}',
						headers: {
							'Content-Type': 'application/json',
							'X-Correlation-ID': uuid.v4()
						},
						method: 'POST'
					});
					expect(appealsApiResponse).toEqual({ good: 'data' });
				}
			},
			{
				title: 'PUT when a id is provided',
				given: () => {
					fetch.mockResponseOnce(JSON.stringify({ shouldBe: 'valid' }));

					return {
						c: 'd',
						id: '123-abc'
					};
				},
				expected: (appealsApiResponse) => {
					expect(fetch).toHaveBeenCalledWith(`${config.appeals.url}/api/v1/appeals/123-abc`, {
						body: '{"c":"d","id":"123-abc"}',
						headers: {
							'Content-Type': 'application/json',
							'X-Correlation-ID': uuid.v4()
						},
						method: 'PUT'
					});
					expect(appealsApiResponse).toEqual({ shouldBe: 'valid' });
				}
			}
		].forEach(({ title, given, expected }) => {
			it(`should ${title}`, async () => {
				const appealsApiResponse = await createOrUpdateAppeal(given());
				expected(appealsApiResponse);
			});
		});

		it('should gracefully handle a fetch failure', async () => {
			fetch.mockResponseOnce(JSON.stringify({ errors: ['something went wrong'] }), {
				status: 400
			});

			/**
			 * Non-standard way to handle functions that throw in Jest.
			 * I believe this is because of `utils.promiseTimout`.
			 */
			try {
				await createOrUpdateAppeal({
					a: 'b'
				});
			} catch (e) {
				expect(e.toString()).toEqual('Error: something went wrong');
			}
		});
	});

	describe('getExistingAppeal', () => {
		it(`should call the expected URL`, async () => {
			fetch.mockResponseOnce(JSON.stringify({ shouldBe: 'valid' }));
			await getExistingAppeal('123');
			expect(fetch.mock.calls[0][0]).toEqual('http://fake.url/api/v1/appeals/123');
		});
	});

	describe('getLPAList', () => {
		it(`should call the expected URL`, async () => {
			fetch.mockResponseOnce(JSON.stringify({ shouldBe: 'valid' }));
			await getLPAList();
			expect(fetch.mock.calls[0][0]).toEqual('http://fake.url/api/v1/local-planning-authorities');
		});
	});

	describe('getLPA', () => {
		it(`should call the expected URL`, async () => {
			fetch.mockResponseOnce(JSON.stringify({ shouldBe: 'valid' }));
			await getLPA('test');
			expect(fetch.mock.calls[0][0]).toEqual(
				'http://fake.url/api/v1/local-planning-authorities/lpaCode/test'
			);
		});
	});

	describe('saveAppeal', () => {
		it('should call the expected URL', async () => {
			fetch.mockResponseOnce(JSON.stringify({ shouldBe: 'valid' }));
			const appealsApiResponse = await saveAppeal({ appeal: 'data' });

			expect(fetch).toHaveBeenCalledWith(`${config.appeals.url}/api/v1/save`, {
				body: '{"appeal":"data"}',
				headers: {
					'Content-Type': 'application/json',
					'X-Correlation-ID': uuid.v4()
				},
				method: 'POST'
			});
			expect(appealsApiResponse).toEqual({ shouldBe: 'valid' });
		});

		it('should handle api fetch failure', async () => {
			fetch.mockResponseOnce(JSON.stringify({ errors: ['something went wrong'] }), {
				status: 400
			});
			try {
				await saveAppeal({
					appeal: 'data'
				});
			} catch (e) {
				expect(e.toString()).toEqual('Error: something went wrong');
			}
		});
	});

	describe('createUser', () => {
		it('should call the expected URL', async () => {
			fetch.mockResponseOnce(JSON.stringify({ shouldBe: 'valid' }));
			const createResponse = await createUser(1, true, 2);

			expect(fetch).toHaveBeenCalledWith(`${config.appeals.url}/api/v1/users/`, {
				body: '{"email":1,"isAdmin":true,"lpaCode":2}',
				headers: {
					'Content-Type': 'application/json',
					'X-Correlation-ID': uuid.v4()
				},
				method: 'POST'
			});
			expect(createResponse).toEqual({ shouldBe: 'valid' });
		});

		it('should handle api fetch failure', async () => {
			fetch.mockResponseOnce(JSON.stringify(['something went wrong']), {
				status: 400
			});
			try {
				await createUser(1, true, 2);
			} catch (e) {
				expect(e.toString()).toEqual('Error: something went wrong');
			}
		});
	});

	describe('getUser', () => {
		it('should get user by id', async () => {
			const id = '6492dc1740b8f50012347237';
			const mockResponse = {
				_id: id,
				email: 'admin1@example.com',
				isAdmin: true,
				enabled: true,
				lpaCode: 'Q9999'
			};
			fetch.mockResponseOnce(JSON.stringify(mockResponse));
			const createResponse = await getUserById(id);

			expect(fetch).toHaveBeenCalledWith(`${config.appeals.url}/api/v1/users/${id}`, {
				headers: {
					'Content-Type': 'application/json',
					'X-Correlation-ID': uuid.v4()
				},
				method: 'GET'
			});
			expect(createResponse).toEqual(mockResponse);
		});
		it('should get user by email', async () => {
			const email = 'admin1%40example.com';
			const mockResponse = {
				_id: '6492dc1740b8f50012347237',
				email: email,
				isAdmin: true,
				enabled: true,
				lpaCode: 'Q9999'
			};
			fetch.mockResponseOnce(JSON.stringify(mockResponse));
			const createResponse = await getUserByEmail(email);

			expect(fetch).toHaveBeenCalledWith(`${config.appeals.url}/api/v1/users/${email}`, {
				headers: {
					'Content-Type': 'application/json',
					'X-Correlation-ID': uuid.v4()
				},
				method: 'GET'
			});
			expect(createResponse).toEqual(mockResponse);
		});

		it('should handle api fetch failure', async () => {
			fetch.mockResponseOnce(JSON.stringify(['something went wrong']), {
				status: 400
			});
			try {
				const email = 'admin1%40example.com';
				await getUserByEmail(email);
			} catch (e) {
				expect(e.toString()).toEqual('Error: something went wrong');
			}
		});
	});

	describe('getUsers', () => {
		it('should get users by lpaCode', async () => {
			const lpaCode = '123';
			const mockResponse = [{ a: 1 }, { a: 2 }];
			fetch.mockResponseOnce(JSON.stringify(mockResponse));
			const createResponse = await getUsers(lpaCode);

			expect(fetch).toHaveBeenCalledWith(`${config.appeals.url}/api/v1/users/?lpaCode=${lpaCode}`, {
				headers: {
					'Content-Type': 'application/json',
					'X-Correlation-ID': uuid.v4()
				},
				method: 'GET'
			});
			expect(createResponse).toEqual(mockResponse);
		});

		it('should handle api fetch failure', async () => {
			fetch.mockResponseOnce(JSON.stringify(['something went wrong']), {
				status: 400
			});
			try {
				const lpaCode = '123';
				await getUsers(lpaCode);
			} catch (e) {
				expect(e.toString()).toEqual('Error: something went wrong');
			}
		});
	});

	describe('removeUser', () => {
		it('should remove user by id', async () => {
			const id = '6492dc1740b8f50012347237';
			const mockResponse = {};
			fetch.mockResponseOnce(JSON.stringify(mockResponse));
			const createResponse = await removeUser(id);

			expect(fetch).toHaveBeenCalledWith(`${config.appeals.url}/api/v1/users/${id}`, {
				headers: {
					'Content-Type': 'application/json',
					'X-Correlation-ID': uuid.v4()
				},
				method: 'DELETE'
			});
			expect(createResponse).toEqual(mockResponse);
		});
		it('should handle api fetch failure', async () => {
			fetch.mockResponseOnce(JSON.stringify(['something went wrong']), {
				status: 400
			});
			try {
				const id = '6492dc1740b8f50012347237';
				await removeUser(id);
			} catch (e) {
				expect(e.toString()).toEqual('Error: something went wrong');
			}
		});
	});

	describe('submitQuestionnaireResponse', () => {
		it('should remove user by id', async () => {
			const id = '6492dc1740b8f50012347237';
			const mockResponse = {};
			fetch.mockResponseOnce(JSON.stringify(mockResponse));
			const createResponse = await removeUser(id);

			expect(fetch).toHaveBeenCalledWith(`${config.appeals.url}/api/v1/users/${id}`, {
				headers: {
					'Content-Type': 'application/json',
					'X-Correlation-ID': uuid.v4()
				},
				method: 'DELETE'
			});
			expect(createResponse).toEqual(mockResponse);
		});
		it('should handle api fetch failure', async () => {
			fetch.mockResponseOnce(JSON.stringify(['something went wrong']), {
				status: 400
			});
			try {
				const id = '6492dc1740b8f50012347237';
				await removeUser(id);
			} catch (e) {
				expect(e.toString()).toEqual('Error: something went wrong');
			}
		});
	});
});
