const { getCookies, postCookies } = require('../../../src/controllers/cookies');
const cookieConfig = require('../../../src/lib/client-side/cookie/cookie-config');
const appConfig = require('../../../src/config');
const getPreviousPagePath = require('../../../src/lib/get-previous-page-path');
const { VIEW } = require('../../../src/lib/views');
const { mockReq, mockRes } = require('../mocks');
const { addFlashMessage } = require('../../../src/lib/flash-message');
const { removeUnwantedCookies } = require('../../../src/lib/remove-unwanted-cookies');

jest.mock('../../../src/config');
jest.mock('../../../src/lib/remove-unwanted-cookies');
jest.mock('../../../src/lib/flash-message');
jest.mock('../../../src/lib/get-previous-page-path');

describe('controllers/cookies', () => {
	const FIXED_SYSTEM_TIME = '2020-11-18T00:00:00Z';
	const fakePreviousPage = '/some/previous/page';

	let req;
	let res;

	beforeEach(() => {
		jest.resetAllMocks();

		req = {
			...mockReq(),
			body: {},
			cookies: {},
			log: {
				warn: jest.fn()
			}
		};
		res = mockRes();

		// https://github.com/facebook/jest/issues/2234#issuecomment-730037781
		jest.useFakeTimers('modern');
		jest.setSystemTime(Date.parse(FIXED_SYSTEM_TIME));
	});

	afterEach(() => {
		jest.useRealTimers();
	});

	describe('getCookies', () => {
		beforeEach(() => {
			getPreviousPagePath.mockImplementation(() => fakePreviousPage);
		});

		it('should not throw if cannot parse req.cookies value', () => {
			req.cookies[cookieConfig.COOKIE_POLICY_KEY] = 'blurgh';

			getCookies(req, res);

			expect(req.log.warn).toHaveBeenCalledWith(
				new SyntaxError(`Unexpected token 'b', "blurgh" is not valid JSON`),
				'Get cookies.'
			);

			expect(res.render).toHaveBeenCalledWith(VIEW.COOKIES, {
				cookiePolicy: {},
				previousPagePath: fakePreviousPage,
				displayCookieBanner: false
			});
		});

		it('should call the correct template', () => {
			getCookies(req, res);

			expect(res.render).toHaveBeenCalledWith(VIEW.COOKIES, {
				cookiePolicy: undefined,
				previousPagePath: fakePreviousPage,
				displayCookieBanner: false
			});
		});
	});

	describe('postCookies', () => {
		it('should redirect on the happy path - no data submitted', () => {
			postCookies(req, res);

			expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.COOKIES}`);

			expect(res.cookie).not.toHaveBeenCalled();
		});

		it('calls the correct template on error', () => {
			req = {
				...req,
				body: {
					errors: { a: 'b' }
				}
			};

			postCookies(req, res);

			expect(res.render).toHaveBeenCalledWith(VIEW.COOKIES, {
				cookiePolicy: undefined,
				displayCookieBanner: false
			});

			expect(res.cookie).not.toHaveBeenCalled();
		});

		describe('should redirect on the happy path', () => {
			const resCookieCallTest = (usage, secure) => {
				expect(res.cookie).toHaveBeenCalledWith(
					cookieConfig.COOKIE_POLICY_KEY,
					JSON.stringify({
						...cookieConfig.DEFAULT_COOKIE_POLICY,
						usage
					}),
					{
						encode: encodeURIComponent,
						expires: new Date('2021-11-18T00:00:00.000Z'),
						sameSite: 'Lax',
						secure
					}
				);
			};

			[
				{
					description: 'Not in production, disable usage cookies',
					before: () => {
						appConfig.isProduction = false;
					},
					setupReq: () => ({
						...req,
						body: {
							'usage-cookies': 'off',
							previous_page_path: fakePreviousPage
						}
					}),
					runExtraAssertions: () => {
						resCookieCallTest(false, false);
						expect(removeUnwantedCookies).toHaveBeenCalledWith(req, res);
					},
					expectedPreviousPagePath: fakePreviousPage
				},
				{
					description: 'Not in production, enable usage cookies',
					before: () => {
						appConfig.isProduction = false;
					},
					setupReq: () => ({
						...req,
						body: {
							'usage-cookies': 'on'
						}
					}),
					expectedPreviousPagePath: '/',
					runExtraAssertions: () => {
						resCookieCallTest(true, false);
						expect(removeUnwantedCookies).not.toHaveBeenCalled();
					}
				},
				{
					description: 'In production, disable usage cookies',
					before: () => {
						appConfig.isProduction = true;
					},
					setupReq: () => ({
						...req,
						body: {
							'usage-cookies': 'off'
						}
					}),
					expectedPreviousPagePath: '/',
					runExtraAssertions: () => {
						resCookieCallTest(false, true);
						expect(removeUnwantedCookies).toHaveBeenCalledWith(req, res);
					}
				},
				{
					description: 'In production,  enable usage cookies',
					before: () => {
						appConfig.isProduction = true;
					},
					setupReq: () => ({
						...req,
						body: {
							'usage-cookies': 'on',
							previous_page_path: fakePreviousPage
						}
					}),
					runExtraAssertions: () => {
						resCookieCallTest(true, true);
						expect(removeUnwantedCookies).not.toHaveBeenCalled();
					},
					expectedPreviousPagePath: fakePreviousPage
				}
			].forEach(
				({ description, before, setupReq, expectedPreviousPagePath, runExtraAssertions }) => {
					test(`with data submitted - ${description}`, () => {
						before();
						req = setupReq();

						postCookies(req, res);

						expect(addFlashMessage).toHaveBeenCalledWith(req, {
							type: 'success',
							template: {
								path: `${VIEW.MESSAGES.COOKIES_UPDATED_SUCCESSFULLY}.njk`,
								vars: {
									previousPagePath: expectedPreviousPagePath
								}
							}
						});

						expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.COOKIES}`);

						runExtraAssertions(req, res);
					});
				}
			);

			afterEach(() => {
				appConfig.isProduction = false;
			});
		});
	});
});
