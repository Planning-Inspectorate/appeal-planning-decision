const { mockReq, mockRes } = require('../mocks');
const navigationHistoryMiddleware = require('../../../src/middleware/navigation-history');

describe('middleware/navigation-history', () => {
	[
		// things went badly wrong
		{
			description: 'no session, return early',
			given: () => {
				const req = mockReq();
				delete req.session;
				return {
					config: undefined,
					req
				};
			},
			expected: (req, res, next) => {
				expect(next).toHaveBeenCalled();
				expect(req.session).toBe(undefined);
			}
		},
		// somehow req.session.navigationHistory got messed up, let's reset
		{
			description: 'req.session.navigationHistory is not an array',
			given: () => ({
				config: undefined,
				req: {
					...mockReq(),
					session: {
						navigationHistory: 'some bad value'
					},
					baseUrl: '',
					path: '/before-you-start'
				}
			}),
			expected: (req, res, next) => {
				expect(next).toHaveBeenCalled();
				expect(req.session.navigationHistory).toEqual(['/before-you-start']);
			}
		},
		// req.session.navigationHistory has been set to a default value
		{
			description:
				'req.session.navigationHistory fall back :: initial visit, requested path matches default fallbackPath',
			given: () => ({
				config: undefined,
				req: {
					...mockReq(),
					baseUrl: '',
					path: '/before-you-start'
				}
			}),
			expected: (req, res, next) => {
				expect(next).toHaveBeenCalled();
				expect(req.session.navigationHistory).toEqual(['/before-you-start']);
			}
		},
		{
			description:
				'req.session.navigationHistory fall back :: initial visit, requested path does not match fallbackPath',
			given: () => ({
				config: undefined,
				req: {
					...mockReq(),
					baseUrl: '',
					path: '/some/page'
				}
			}),
			expected: (req, res, next) => {
				expect(next).toHaveBeenCalled();
				expect(req.session.navigationHistory).toEqual(['/some/page', '/before-you-start']);
			}
		},
		// req.session.navigationHistory is a valid array
		{
			description:
				'req.session.navigationHistory is a valid array :: initial visit, requested path matches default fallbackPath',
			given: () => ({
				config: undefined,
				req: {
					...mockReq(),
					session: {
						...mockReq().session,
						navigationHistory: []
					},
					baseUrl: '',
					path: '/'
				}
			}),
			expected: (req, res, next) => {
				expect(next).toHaveBeenCalled();
				expect(req.session.navigationHistory).toEqual(['/']);
			}
		},
		{
			description:
				'req.session.navigationHistory is a valid array :: initial visit, requested path does not match fallbackPath',
			given: () => ({
				config: undefined,
				req: {
					...mockReq(),
					session: {
						...mockReq().session,
						navigationHistory: []
					},
					baseUrl: '',
					path: '/a/path/here'
				}
			}),
			expected: (req, res, next) => {
				expect(next).toHaveBeenCalled();
				expect(req.session.navigationHistory).toEqual(['/a/path/here']);
			}
		},
		{
			description:
				'req.session.navigationHistory is a valid array :: subsequent visit, one item in the navigationHistory stack ::: requested path matches last page in the navigationHistory stack',
			given: () => ({
				config: undefined,
				req: {
					...mockReq(),
					session: {
						...mockReq().session,
						navigationHistory: ['/a/b/c']
					},
					baseUrl: '',
					path: '/a/b/c'
				}
			}),
			expected: (req, res, next) => {
				expect(next).toHaveBeenCalled();
				expect(req.session.navigationHistory).toEqual(['/a/b/c']);
			}
		},
		{
			description:
				'req.session.navigationHistory is a valid array :: subsequent visit, two items in the navigationHistory stack ::: requested path matches last page in the navigationHistory stack',
			given: () => ({
				config: undefined,
				req: {
					...mockReq(),
					session: {
						...mockReq().session,
						navigationHistory: ['/d/e/f', '/a/b/c']
					},
					baseUrl: '',
					path: '/d/e/f'
				}
			}),
			expected: (req, res, next) => {
				expect(next).toHaveBeenCalled();
				expect(req.session.navigationHistory).toEqual(['/d/e/f', '/a/b/c']);
			}
		},
		{
			description:
				'req.session.navigationHistory is a valid array :: subsequent visit, two items in the navigationHistory stack ::: requested path matches req.session.navigationHistory[1] in the navigationHistory stack',
			given: () => ({
				config: undefined,
				req: {
					...mockReq(),
					session: {
						...mockReq().session,
						navigationHistory: ['/d/e/f', '/a/b/c']
					},
					baseUrl: '',
					path: '/a/b/c'
				}
			}),
			expected: (req, res, next) => {
				expect(next).toHaveBeenCalled();
				expect(req.session.navigationHistory).toEqual(['/a/b/c']);
			}
		},
		// custom environments
		{
			description: 'custom environments :: override fallbackPath',
			given: () => ({
				config: {
					fallbackPath: '/some/custom/path'
				},
				req: {
					...mockReq(),
					baseUrl: '',
					path: '/d/e/f'
				}
			}),
			expected: (req, res, next) => {
				expect(next).toHaveBeenCalled();
				expect(req.session.navigationHistory).toEqual(['/d/e/f', '/some/custom/path']);
			}
		},
		{
			description: 'custom environments :: override stackSize',
			given: () => ({
				config: {
					stackSize: 3
				},
				req: {
					...mockReq(),
					session: {
						...mockReq().session,
						navigationHistory: ['/a', '/b', '/c', '/d', '/e']
					},
					baseUrl: '',
					path: '/x/y/z'
				}
			}),
			expected: (req, res, next) => {
				expect(next).toHaveBeenCalled();
				expect(req.session.navigationHistory).toEqual(['/x/y/z', '/a', '/b']);
			}
		},
		{
			description: 'should not add published-document links to the navigation history',
			given: () => ({
				config: undefined,
				req: {
					...mockReq(),
					session: {
						...mockReq().session,
						navigationHistory: ['/previous-page']
					},
					baseUrl: '',
					path: '/published-document/some-document-id'
				}
			}),
			expected: (req, res, next) => {
				expect(next).toHaveBeenCalled();
				expect(req.session.navigationHistory).toEqual(['/previous-page']);
			}
		}
	].forEach(({ description, given, expected }) => {
		it(description, () => {
			const next = jest.fn();
			const { req, config } = given();

			navigationHistoryMiddleware(config)(req, mockRes(), next);

			expected(req, mockRes(), next);
		});
	});
});
