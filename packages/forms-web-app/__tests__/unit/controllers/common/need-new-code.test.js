const {
	getNeedNewCode,
	postNeedNewCode
} = require('../../../../src/controllers/common/need-new-code');
const { enterCodeConfig } = require('@pins/common');

const { mockRes, mockReq } = require('../../mocks');
const { sendToken, getUserById } = require('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/lib/appeals-api-wrapper');

describe('controllers/common/enter-code', () => {
	let req;
	let res;

	beforeEach(() => {
		res = mockRes();
		req = mockReq();
		req.session = {};
		jest.resetAllMocks();
	});

	describe('getNeedNewCode', () => {
		it('should redirect to correct page', async () => {
			const {
				VIEW: {
					LPA_DASHBOARD: { NEED_NEW_CODE }
				}
			} = require('../../../../src/lib/views');
			const views = { NEED_NEW_CODE };

			const returnedFunction = getNeedNewCode(views);
			await returnedFunction(req, res);

			expect(res.render).toBeCalledWith(`${NEED_NEW_CODE}`);
		});
	});

	describe('postRequestNewCode', () => {
		const badUserResponseValues = [undefined, null, {}, { prop: 'test' }];

		for (const badVal of badUserResponseValues) {
			it(`should redirect to enter code page if user response is not valid`, async () => {
				const {
					VIEW: {
						LPA_DASHBOARD: { NEED_NEW_CODE, ENTER_CODE }
					}
				} = require('../../../../src/lib/views');
				const views = { NEED_NEW_CODE, ENTER_CODE };
				const tokenId = '1552441a-1e56-4e83-8d85-de7b246d2594';

				getUserById.mockResolvedValue(badVal);

				const returnedFunction = postNeedNewCode(views);
				req.params = {
					id: tokenId
				};
				await returnedFunction(req, res);

				expect(getUserById).toBeCalledWith(tokenId);
				expect(res.redirect).toBeCalledWith(`/${ENTER_CODE}/${tokenId}`);
			});
		}

		it(`should redirect to enter code page if user response returns an error`, async () => {
			const {
				VIEW: {
					LPA_DASHBOARD: { NEED_NEW_CODE, ENTER_CODE }
				}
			} = require('../../../../src/lib/views');
			const views = { NEED_NEW_CODE, ENTER_CODE };
			const tokenId = '1552441a-1e56-4e83-8d85-de7b246d2594';

			getUserById.mockImplementation(() => {
				throw new Error('Failed');
			});

			const returnedFunction = postNeedNewCode(views);
			req.params = {
				id: tokenId
			};
			await returnedFunction(req, res);

			expect(getUserById).toBeCalledWith(tokenId);
			expect(res.redirect).toBeCalledWith(`/${ENTER_CODE}/${tokenId}`);
		});

		it(`should redirect to enter code page if sendToken returns an error`, async () => {
			const {
				VIEW: {
					LPA_DASHBOARD: { NEED_NEW_CODE, ENTER_CODE }
				}
			} = require('../../../../src/lib/views');
			const views = { NEED_NEW_CODE, ENTER_CODE };
			const tokenId = '1552441a-1e56-4e83-8d85-de7b246d2594';
			const fakeUserResponse = {
				email: 'test@example.com'
			};

			getUserById.mockResolvedValue(fakeUserResponse);

			sendToken.mockImplementation(() => {
				throw new Error('Failed');
			});

			const returnedFunction = postNeedNewCode(views);
			req.params = {
				id: tokenId
			};
			await returnedFunction(req, res);

			expect(getUserById).toBeCalledWith(tokenId);
			expect(sendToken).toBeCalledWith(
				tokenId,
				enterCodeConfig.actions.lpaDashboard,
				fakeUserResponse.email
			);
			expect(res.redirect).toBeCalledWith(`/${ENTER_CODE}/${tokenId}`);
		});

		it(`should redirect to enter code page if sendToken works`, async () => {
			const {
				VIEW: {
					LPA_DASHBOARD: { NEED_NEW_CODE, ENTER_CODE }
				}
			} = require('../../../../src/lib/views');
			const views = { NEED_NEW_CODE, ENTER_CODE };
			const tokenId = '1552441a-1e56-4e83-8d85-de7b246d2594';
			const fakeUserResponse = {
				email: 'test@example.com'
			};

			getUserById.mockResolvedValue(fakeUserResponse);

			const returnedFunction = postNeedNewCode(views);
			req.params = {
				id: tokenId
			};
			await returnedFunction(req, res);

			expect(getUserById).toBeCalledWith(tokenId);
			expect(sendToken).toBeCalledWith(
				tokenId,
				enterCodeConfig.actions.lpaDashboard,
				fakeUserResponse.email
			);
			expect(res.redirect).toBeCalledWith(`/${ENTER_CODE}/${tokenId}`);
		});
	});
});
