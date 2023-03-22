const {
	getEnterCode,
	postEnterCode
} = require('../../../../../src/controllers/full-appeal/submit-appeal/enter-code');
const {
	VIEW: {
		FULL_APPEAL: { TASK_LIST, ENTER_CODE, CODE_EXPIRED, APPEAL_ALREADY_SUBMITTED }
	}
} = require('../../../../../src/lib/views');
const fullAppeal = require('@pins/business-rules/test/data/full-appeal');
const { mockReq, mockRes } = require('../../../mocks');
const { getSavedAppeal, getExistingAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const { hasDeadlineDatePassed } = require('../../../../../src/lib/calculate-deadline');
const { isTokenValid } = require('../../../../../src/lib/is-token-valid');

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/lib/calculate-deadline');
jest.mock('../../../../../src/lib/is-token-expired');
jest.mock('../../../../../src/lib/is-token-valid');

describe('controllers/full-appeal/submit-appeal/enter-code', () => {
	let req;
	let res;
	beforeEach(() => {
		req = mockReq(fullAppeal);
		res = mockRes();
		jest.resetAllMocks();
	});
	describe('getEnterCode', () => {
		it('should render enter code page when receiving the token from email', async () => {
			const url = '/full-appeal/submit-appeal/request-new-code';

			hasDeadlineDatePassed.mockReturnValue(false);
			getSavedAppeal.mockReturnValue({
				token: '12312'
			});

			await getEnterCode(req, res);

			expect(res.render).toBeCalledWith(`${ENTER_CODE}`, { requestNewCodeLink: url });
		});
	});
	describe('postEnterCode', () => {
		it('should render task list page when entering valid token', async () => {
			req.body = { 'email-code': '12312' };
			req.session.appeal = { id: 'appealId' };

			isTokenValid.mockReturnValue(true);
			getSavedAppeal.mockReturnValue({
				token: '12312',
				createdAt: '2022-07-14T13:00:48.024Z'
			});
			getExistingAppeal.mockReturnValue({
				id: 'appealId'
			});

			await postEnterCode(req, res);

			expect(isTokenValid).toBeCalledWith('appealId', '12312');
			expect(res.redirect).toBeCalledWith(`/${TASK_LIST}`);
			expect(req.session.appeal).toEqual({ id: 'appealId' });
		});
		it('should render code expired page when token is expired', async () => {
			req.body = { 'email-code': '12312' };
			req.session.appeal = { id: 'appealId' };

			isTokenValid.mockReturnValue(false);
			getSavedAppeal.mockReturnValue({
				token: '12312',
				createdAt: '2022-07-14T13:00:48.024Z'
			});
			getExistingAppeal.mockReturnValue({
				id: 'appealId'
			});

			await postEnterCode(req, res);

			expect(isTokenValid).toBeCalledWith('appealId', '12312');
			expect(res.redirect).toBeCalledWith(`/${CODE_EXPIRED}`);
		});
		it('should render appeal already submitted page when appeal is already complete', async () => {
			req.body = { 'email-code': '12312' };
			req.session.appeal = { id: 'appealId' };

			isTokenValid.mockReturnValue(true);
			getSavedAppeal.mockReturnValue({
				token: '12312',
				createdAt: '2022-07-14T13:00:48.024Z'
			});
			getExistingAppeal.mockReturnValue({
				id: 'appealId',
				state: 'SUBMITTED'
			});

			await postEnterCode(req, res);

			expect(res.redirect).toBeCalledWith(`/${APPEAL_ALREADY_SUBMITTED}`);
		});
	});
});
