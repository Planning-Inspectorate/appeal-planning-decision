const { getEnterCode, postEnterCode } = require('../../../../src/controllers/common/enter-code');

const views = require('../../../../src/lib/views');
const householderAppealViews = views.VIEW.APPELLANT_SUBMISSION;
const fullAppealViews = views.VIEW.FULL_APPEAL;

const householderAppeal = require('@pins/business-rules/test/data/householder-appeal');
const fullAppeal = require('@pins/business-rules/test/data/full-appeal');
const { mockReq, mockRes } = require('../../mocks');
const {
	getSavedAppeal,
	getExistingAppeal,
	sendToken
} = require('../../../../src/lib/appeals-api-wrapper');
const { isTokenValid } = require('../../../../src/lib/is-token-valid');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/lib/is-token-valid');

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
		it('should render page but not call sendToken when no req.params.id or appeal in session', async () => {
			const { REQUEST_NEW_CODE, ENTER_CODE } = householderAppealViews;
			const url = `/${REQUEST_NEW_CODE}`;

			const returnedFunction = getEnterCode({ REQUEST_NEW_CODE, ENTER_CODE });
			await returnedFunction(req, res);

			expect(res.render).toBeCalledWith(`${ENTER_CODE}`, { requestNewCodeLink: url });
			expect(sendToken).not.toBeCalled();
			expect(req.session.userTokenId).not.toBeDefined();
		});

		it('should redirect to enter-code/:id when an appeal id exists in session and no req.params.id provided', async () => {
			const { ENTER_CODE } = fullAppealViews;
			req.session.appeal = fullAppeal;

			const returnedFunction = getEnterCode({ ENTER_CODE });
			await returnedFunction(req, res);

			expect(res.redirect).toBeCalledWith(`/${ENTER_CODE}/${req.session.appeal.id}`);
			expect(sendToken).not.toBeCalled();
			expect(req.session.userTokenId).not.toBeDefined();
		});

		describe('when req.params.id is provided', () => {
			it('should render page if sendToken call succeeds', async () => {
				const { ENTER_CODE, REQUEST_NEW_CODE } = householderAppealViews;
				const url = `/${REQUEST_NEW_CODE}`;
				req = {
					...req,
					params: { id: '89aa8504-773c-42be-bb68-029716ad9756' }
				};
				sendToken.mockReturnValue({});

				const returnedFunction = getEnterCode({ ENTER_CODE, REQUEST_NEW_CODE });
				await returnedFunction(req, res);

				expect(sendToken).toBeCalled();
				expect(res.render).toBeCalledWith(`${ENTER_CODE}`, { requestNewCodeLink: url });
				expect(req.session.userTokenId).toEqual(req.params.id);
			});

			it('should render page but not call sendToken if validation errors in req.session', async () => {
				const { ENTER_CODE, REQUEST_NEW_CODE } = fullAppealViews;
				const url = `/${REQUEST_NEW_CODE}`;
				const errors = { 'mock-error': 'Error message' };

				req = {
					...req,
					params: { id: '89aa8504-773c-42be-bb68-029716ad9756' },
					body: {
						errors
					}
				};

				const returnedFunction = getEnterCode({ ENTER_CODE, REQUEST_NEW_CODE });
				await returnedFunction(req, res);

				expect(sendToken).not.toBeCalled();
				expect(res.render).toBeCalledWith(`${ENTER_CODE}`, { requestNewCodeLink: url });
				expect(req.session.userTokenId).toEqual(req.params.id);
			});

			it('should render page if sendToken call fails', async () => {
				const { ENTER_CODE, REQUEST_NEW_CODE } = householderAppealViews;
				const url = `/${REQUEST_NEW_CODE}`;
				req = {
					...req,
					params: { id: '90aa8504-773c-42be-bb68-029716ad9756' }
				};
				sendToken.mockRejectedValue(() => {
					new Error('error');
				});

				const returnedFunction = getEnterCode({ ENTER_CODE, REQUEST_NEW_CODE });
				await returnedFunction(req, res);

				expect(sendToken).toBeCalled();
				expect(res.render).toBeCalledWith(`${ENTER_CODE}`, { requestNewCodeLink: url });
				expect(req.session.userTokenId).toEqual(req.params.id);
			});
		});
	});
	describe('postEnterCode', () => {
		it('should render page with errors if input validation fails', async () => {
			const { ENTER_CODE } = fullAppealViews;
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

			const returnedFunction = postEnterCode({ ENTER_CODE });
			await returnedFunction(req, res);

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
			const { TASK_LIST } = householderAppealViews;
			const draftAppeal = {
				...householderAppeal,
				state: 'DRAFT'
			};

			req.body = { token: '12312' };
			getSavedAppeal.mockReturnValue({
				token: '12312',
				createdAt: '2022-07-14T13:00:48.024Z'
			});
			isTokenValid.mockReturnValue(true);
			getExistingAppeal.mockReturnValue(draftAppeal);

			const returnedFunction = postEnterCode({ TASK_LIST });
			await returnedFunction(req, res);

			expect(res.redirect).toBeCalledWith(`/${TASK_LIST}`);
			expect(req.session.appeal).toEqual(draftAppeal);
		});

		it('should render code expired page when token is not valid', async () => {
			const { CODE_EXPIRED } = fullAppealViews;
			req.body = { token: '12312' };
			getSavedAppeal.mockReturnValue({
				token: '12312',
				createdAt: '2020-07-14T13:00:48.024Z'
			});
			getExistingAppeal.mockReturnValue({
				fullAppeal
			});
			isTokenValid.mockReturnValue(false);

			const returnedFunction = postEnterCode({ CODE_EXPIRED });
			await returnedFunction(req, res);

			expect(res.redirect).toBeCalledWith(`/${CODE_EXPIRED}`);
			expect(req.session.appeal).not.toEqual(fullAppeal);
		});

		it('should render appeal already submitted page when appeal is already complete', async () => {
			const { APPEAL_ALREADY_SUBMITTED } = householderAppealViews;
			req.body = { token: '12312' };
			getSavedAppeal.mockReturnValue({
				token: '12312',
				createdAt: '2022-07-14T13:00:48.024Z'
			});
			isTokenValid.mockReturnValue(true);

			getExistingAppeal.mockReturnValue({
				...householderAppeal,
				state: 'SUBMITTED'
			});

			const returnedFunction = postEnterCode({ APPEAL_ALREADY_SUBMITTED });
			await returnedFunction(req, res);

			expect(res.redirect).toBeCalledWith(`/${APPEAL_ALREADY_SUBMITTED}`);
		});

		it('should render page with error message if token ok but appeal not found', async () => {
			const { ENTER_CODE } = fullAppealViews;
			req.body = { token: '12312' };
			getSavedAppeal.mockReturnValue({
				token: '12312',
				createdAt: '2022-07-14T13:00:48.024Z'
			});
			isTokenValid.mockReturnValue(true);

			getSavedAppeal.mockRejectedValue(() => {
				new Error('error');
			});

			const returnedFunction = postEnterCode({ ENTER_CODE });
			await returnedFunction(req, res);

			expect(res.render).toBeCalledWith(`${ENTER_CODE}`, {
				errors: {},
				errorSummary: [
					{ text: 'We did not find your appeal. Enter the correct code', href: '#email-code' }
				]
			});
		});
	});
});