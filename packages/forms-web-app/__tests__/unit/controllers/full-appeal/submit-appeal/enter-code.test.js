const {
	getEnterCode,
	postEnterCode
} = require('../../../../../src/controllers/full-appeal/submit-appeal/enter-code');
const {
	VIEW: {
		FULL_APPEAL: { TASK_LIST, ENTER_CODE, CODE_EXPIRED, APPEAL_ALREADY_SUBMITTED }
	}
} = require('../../../../../src/lib/full-appeal/views');
const fullAppeal = require('@pins/business-rules/test/data/full-appeal');
const { mockReq, mockRes } = require('../../../mocks');
const { getSavedAppeal, getExistingAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const { calculateDeadline } = require('../../../../../src/lib/calculate-deadline');
const { isTokenExpired } = require('../../../../../src/lib/is-token-expired');

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/lib/calculate-deadline');
jest.mock('../../../../../src/lib/is-token-expired');

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
			req.session.appeal.state = 'DRAFT';
			const url = '/full-appeal/submit-appeal/request-new-code';
			calculateDeadline.hasDeadlineDatePassed.mockReturnValue(false);
			getSavedAppeal.mockReturnValue({
				token: '12312'
			});
			await getEnterCode(req, res);
			expect(res.render).toBeCalledWith(`${ENTER_CODE}`, { requestNewCodeLink: url });
		});
	});

	describe('postEnterCode', () => {
		it('should render task list page when entering valid token', async () => {
			req.body = { token: '12312' };
			const createdDate = new Date('2022-07-14T13:00:48.024Z');
			getSavedAppeal.mockReturnValue({
				token: '12312',
				createdAt: '2022-07-14T13:00:48.024Z'
			});
			isTokenExpired.mockReturnValue(false);
			getExistingAppeal.mockReturnValue({
				id: 'appealId'
			});

			await postEnterCode(req, res);
			expect(isTokenExpired).toBeCalledWith(30, createdDate);
			expect(res.redirect).toBeCalledWith(`/${TASK_LIST}`);
			expect(req.session.appeal).toEqual({ id: 'appealId' });
		});
		it('should render code expired page when token is expired', async () => {
			req.body = { token: '12312' };
			const createdDate = new Date('2022-07-14T13:00:48.024Z');
			getSavedAppeal.mockReturnValue({
				token: '12312',
				createdAt: '2022-07-14T13:00:48.024Z'
			});
			getExistingAppeal.mockReturnValue({
				id: 'appealId'
			});
			isTokenExpired.mockReturnValue(true);
			await postEnterCode(req, res);
			expect(isTokenExpired).toBeCalledWith(30, createdDate);
			expect(res.redirect).toBeCalledWith(`/${CODE_EXPIRED}`);
		});
		it('should render appeal already submitted page when appeal is already complete', async () => {
			req.body = { token: '12312' };
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
