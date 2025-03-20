const {
	defaultKeepMeCookies,
	removeUnwantedCookies
} = require('../../../src/lib/remove-unwanted-cookies');
const { CONSTS } = require('../../../src/consts');
const { mockReq, mockRes } = require('../mocks');
const cookieConfig = require('../../../src/lib/client-side/cookie/cookie-config');
const {
	extractRootDomainNameFromHostnameAndSubdomains
} = require('../../../src/lib/extract-root-domain-name-from-full-domain-name');

jest.mock('../../../src/lib/extract-root-domain-name-from-full-domain-name');

describe('lib/remove-unwanted-cookies', () => {
	describe('defaultKeepMeCookies', () => {
		it('should have the expected cookie names', () => {
			expect(defaultKeepMeCookies).toEqual([
				CONSTS.SESSION_COOKIE_NAME,
				cookieConfig.COOKIE_POLICY_KEY,
				CONSTS.EASY_AUTH_COOKIE_NAME
			]);
		});
	});

	describe('removeUnwantedCookies', () => {
		const fakeSessionId = 'abc-xyz-123';
		const fakeDomain = 'example.com';

		beforeEach(() => {
			jest.resetAllMocks();

			extractRootDomainNameFromHostnameAndSubdomains.mockImplementation(() => fakeDomain);
		});

		afterEach(() => {
			expect(extractRootDomainNameFromHostnameAndSubdomains).toHaveBeenCalledTimes(1);
		});

		const expectedRemovalCalls = (req, res, cookieName) => {
			expect(res.clearCookie).toHaveBeenCalledWith(cookieName);
			expect(res.clearCookie).toHaveBeenCalledWith(cookieName, {
				domain: `.${fakeDomain}`,
				secure: true
			});
			expect(res.clearCookie).toHaveBeenCalledWith(cookieName, {
				domain: `.${fakeDomain}`,
				secure: false
			});
			expect(res.clearCookie).toHaveBeenCalledWith(cookieName, {
				domain: `.${req.hostname}`,
				secure: true
			});
			expect(res.clearCookie).toHaveBeenCalledWith(cookieName, {
				domain: `.${req.hostname}`,
				secure: false
			});
		};

		[
			{
				title: 'no existing cookies',
				given: {
					req: mockReq(),
					res: mockRes(),
					keepTheseCookies: undefined
				},
				expected: (req, res) => {
					expect(res.clearCookie).not.toHaveBeenCalled();
				}
			},
			{
				title: 'retains session cookie',
				given: {
					req: {
						...mockReq(),
						cookies: {
							'connect.sid': fakeSessionId
						}
					},
					res: mockRes(),
					keepTheseCookies: undefined
				},
				expected: (req, res) => {
					expect(res.clearCookie).not.toHaveBeenCalled();
				}
			},
			{
				title: 'can force session cookie removal if explicitly excluded in keepTheseCookies',
				given: {
					req: {
						...mockReq(),
						cookies: {
							'connect.sid': fakeSessionId
						}
					},
					res: mockRes(),
					keepTheseCookies: []
				},
				expected: (req, res) => {
					expect(res.clearCookie).toHaveBeenCalledTimes(5);
					expectedRemovalCalls(req, res, 'connect.sid');
				}
			},
			{
				title: `retains ${[cookieConfig.COOKIE_POLICY_KEY]}`,
				given: {
					req: {
						...mockReq(),
						cookies: {
							[cookieConfig.COOKIE_POLICY_KEY]: { a: 'b' }
						}
					},
					res: mockRes(),
					keepTheseCookies: undefined
				},
				expected: (req, res) => {
					expect(res.clearCookie).not.toHaveBeenCalled();
				}
			},
			{
				title: `can force ${[
					cookieConfig.COOKIE_POLICY_KEY
				]} removal if explicitly excluded in keepTheseCookies`,
				given: {
					req: {
						...mockReq(),
						cookies: {
							[cookieConfig.COOKIE_POLICY_KEY]: { a: 'b' }
						}
					},
					res: mockRes(),
					keepTheseCookies: []
				},
				expected: (req, res) => {
					expect(res.clearCookie).toHaveBeenCalledTimes(5);
					expectedRemovalCalls(req, res, cookieConfig.COOKIE_POLICY_KEY);
				}
			},
			{
				title: `removes and retains expected with defaults`,
				given: {
					req: {
						...mockReq(),
						cookies: {
							'connect.sid': fakeSessionId,
							[cookieConfig.COOKIE_POLICY_KEY]: { a: 'b' },
							'some-unwanted-cookie': 'i am unwanted :('
						}
					},
					res: mockRes(),
					keepTheseCookies: undefined
				},
				expected: (req, res) => {
					expect(res.clearCookie).toHaveBeenCalledTimes(5);
					expectedRemovalCalls(req, res, 'some-unwanted-cookie');
				}
			},
			{
				title: `removes and retains expected with custom keepTheseCookies`,
				given: {
					req: {
						...mockReq(),
						cookies: {
							'connect.sid': fakeSessionId,
							[cookieConfig.COOKIE_POLICY_KEY]: { a: 'b' },
							'some-unwanted-cookie': 'i am unwanted :('
						}
					},
					res: mockRes(),
					keepTheseCookies: ['some-unwanted-cookie']
				},
				expected: (req, res) => {
					expect(res.clearCookie).toHaveBeenCalledTimes(10);
					expectedRemovalCalls(req, res, 'connect.sid');
					expectedRemovalCalls(req, res, cookieConfig.COOKIE_POLICY_KEY);
				}
			},
			{
				title: `removes and retains expected with real world looking setup`,
				given: {
					req: {
						...mockReq(),
						cookies: {
							'connect.sid':
								's%3Avh3SpX2LGpPS77Do2F0WVt4Gz3FaKP7t.CBnhpm4ua8zP4kXqnXjBC%2BH9%2FOlW%2BNPnuR155nAxvAE',
							_ga_TZBWMVPTHV: 'GS1.1.1615458372.1.1.1615458496.0',
							[cookieConfig.COOKIE_POLICY_KEY]: {
								essential: true,
								settings: false,
								usage: false,
								campaigns: false
							},
							_ga: 'GA1.1.1786687680.1615458372'
						}
					},
					res: mockRes(),
					keepTheseCookies: undefined
				},
				expected: (req, res) => {
					expect(res.clearCookie).toHaveBeenCalledTimes(10);
					expectedRemovalCalls(req, res, '_ga_TZBWMVPTHV');
					expectedRemovalCalls(req, res, '_ga');
				}
			}
		].forEach(({ title, given: { req, res, keepTheseCookies }, expected }) => {
			it(`should retain the expected cookies - ${title}`, () => {
				removeUnwantedCookies(req, res, keepTheseCookies);
				expected(req, res);
			});
		});
	});
});
