const {
	getEnterCode,
	postEnterCode
} = require('../../../../../src/controllers/full-appeal/submit-appeal/enter-code');
const {
	VIEW: {
		FULL_APPEAL: { TASK_LIST, ENTER_CODE, CODE_EXPIRED, APPEAL_ALREADY_SUBMITTED, REQUEST_NEW_CODE }
	}
} = require('../../../../../src/lib/views');
const fullAppeal = require('@pins/business-rules/test/data/full-appeal');
const { mockReq, mockRes } = require('../../../mocks');
const {
	getSavedAppeal,
	getExistingAppeal,
	sendToken
} = require('../../../../../src/lib/appeals-api-wrapper');
const { isTokenValid } = require('../../../../../src/lib/is-token-valid');

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/lib/is-token-valid');

describe('controllers/full-appeal/submit-appeal/enter-code', () => {
	let req;
	let res;
	beforeEach(() => {
		req = mockReq();
		req = {
			...req,
			body: {}
		};
		delete req.session.appeal;
		res = mockRes();
		jest.resetAllMocks();
	});
	describe('getEnterCode', () => {
		const url = `/${REQUEST_NEW_CODE}`;

		it('should render page but not call sendToken when no req.params.id or appeal in session', async () => {
			await getEnterCode(req, res);

			expect(res.render).toBeCalledWith(`${ENTER_CODE}`, { requestNewCodeLink: url });
			expect(sendToken).not.toBeCalled();
			expect(req.session.userTokenId).not.toBeDefined();
		});

		it('should redirect to enter-code/:id when an appeal id exists in session and no req.params.id provided', async () => {
			req.session.appeal = fullAppeal;

			await getEnterCode(req, res);

			expect(res.redirect).toBeCalledWith(`/${ENTER_CODE}/${req.session.appeal.id}`);
			expect(sendToken).not.toBeCalled();
			expect(req.session.userTokenId).not.toBeDefined();
		});

		describe('when req.params.id is provided', () => {
			it('should render page if sendToken call succeeds', async () => {
				req = {
					...req,
					params: { id: '89aa8504-773c-42be-bb68-029716ad9756' }
				};
				sendToken.mockReturnValue({});

				await getEnterCode(req, res);

				expect(sendToken).toBeCalled();
				expect(res.render).toBeCalledWith(`${ENTER_CODE}`, { requestNewCodeLink: url });
				expect(req.session.userTokenId).toEqual(req.params.id);
			});

			it('should render page but not call sendToken if validation errors in req.session', async () => {
				const errors = { 'mock-error': 'Error message' };

				req = {
					...req,
					params: { id: '89aa8504-773c-42be-bb68-029716ad9756' },
					body: {
						errors
					}
				};

				await getEnterCode(req, res);

				expect(sendToken).not.toBeCalled();
				expect(res.render).toBeCalledWith(`${ENTER_CODE}`, { requestNewCodeLink: url });
				expect(req.session.userTokenId).toEqual(req.params.id);
			});

			it('should render page if sendToken call fails', async () => {
				req = {
					...req,
					params: { id: '90aa8504-773c-42be-bb68-029716ad9756' }
				};
				sendToken.mockRejectedValue(() => {
					new Error('error');
				});

				await getEnterCode(req, res);

				expect(sendToken).toBeCalled();
				expect(res.render).toBeCalledWith(`${ENTER_CODE}`, { requestNewCodeLink: url });
				expect(req.session.userTokenId).toEqual(req.params.id);
			});
		});
	});
	describe('postEnterCode', () => {
		it('should render page with errors if input validation fails', async () => {
			const errors = { 'mock-error': 'Error message' };
			const errorSummary = [{ text: 'There was an error', href: '#' }];

			req = {
				...req,
				body: {
					'email-code': '12345',
					errors,
					errorSummary
				},
				params: { id: 'not-a-valid-id' }
			};

			await postEnterCode(req, res);

			expect(res.render).toBeCalledWith(`${ENTER_CODE}`, {
				token: req.body['email-code'],
				errors: errors,
				errorSummary: errorSummary
			});
			expect(isTokenValid).not.toBeCalled();
			expect(getSavedAppeal).not.toBeCalled();
			expect(getExistingAppeal).not.toBeCalled();
		});

		it('should render task list page when entering valid token', async () => {
			const draftFullAppeal = {
				...fullAppeal,
				state: 'DRAFT'
			};

			req.body = { token: '12312' };
			getSavedAppeal.mockReturnValue({
				token: '12312',
				createdAt: '2022-07-14T13:00:48.024Z'
			});
			isTokenValid.mockReturnValue(true);
			getExistingAppeal.mockReturnValue(draftFullAppeal);

			await postEnterCode(req, res);

			expect(res.redirect).toBeCalledWith(`/${TASK_LIST}`);
			expect(req.session.appeal).toEqual(draftFullAppeal);
		});

		it('should render code expired page when token is not valid', async () => {
			req.body = { token: '12312' };
			getSavedAppeal.mockReturnValue({
				token: '12312',
				createdAt: '2020-07-14T13:00:48.024Z'
			});
			getExistingAppeal.mockReturnValue({
				fullAppeal
			});
			isTokenValid.mockReturnValue(false);
			await postEnterCode(req, res);

			expect(res.redirect).toBeCalledWith(`/${CODE_EXPIRED}`);
			expect(req.session.appeal).not.toEqual(fullAppeal);
		});

		it('should render appeal already submitted page when appeal is already complete', async () => {
			req.body = { token: '12312' };
			getSavedAppeal.mockReturnValue({
				token: '12312',
				createdAt: '2022-07-14T13:00:48.024Z'
			});
			isTokenValid.mockReturnValue(true);

			getExistingAppeal.mockReturnValue({
				...fullAppeal,
				state: 'SUBMITTED'
			});

			await postEnterCode(req, res);
			expect(res.redirect).toBeCalledWith(`/${APPEAL_ALREADY_SUBMITTED}`);
		});

		it('should render page with error message if token ok but appeal not found', async () => {
			req.body = { token: '12312' };
			getSavedAppeal.mockReturnValue({
				token: '12312',
				createdAt: '2022-07-14T13:00:48.024Z'
			});
			isTokenValid.mockReturnValue(true);

			getSavedAppeal.mockRejectedValue(() => {
				new Error('error');
			});

			await postEnterCode(req, res);
			expect(res.render).toBeCalledWith(`${ENTER_CODE}`, {
				errors: {},
				errorSummary: [{ text: 'No saved appeal was found for the given id', href: '#' }]
			});
		});
	});
});
