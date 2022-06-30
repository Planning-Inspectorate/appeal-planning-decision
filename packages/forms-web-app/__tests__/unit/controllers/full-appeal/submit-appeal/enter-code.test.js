const {
	getEnterCode,
	postEnterCode
} = require('../../../../../src/controllers/full-appeal/submit-appeal/enter-code');
const {
	VIEW: {
		FULL_APPEAL: { TASK_LIST, ENTER_CODE }
	}
} = require('../../../../../src/lib/full-appeal/views');
const { mockReq, mockRes } = require('../../../mocks');
const { getSavedAppeal, getExistingAppeal } = require('../../../../../src/lib/appeals-api-wrapper');

jest.mock('../../../../../src/lib/appeals-api-wrapper');

describe('controllers/full-appeal/submit-appeal/enter-code', () => {
	let req;
	let res;
	beforeEach(() => {
		req = mockReq();
		res = mockRes();
		jest.resetAllMocks();
	});
	describe('getEnterCode', () => {
		it('should render enter code page when receiving the token from email', async () => {
			getSavedAppeal.mockReturnValue({
				token: '12312'
			});
			await getEnterCode(req, res);
			expect(res.render).toBeCalledWith(`${ENTER_CODE}`);
		});
	});
	describe('postEnterCode', () => {
		it('should render task list page when entering the token from email', async () => {
			req.body = { token: '12312' };
			getSavedAppeal.mockReturnValue({
				token: '12312'
			});
			getExistingAppeal.mockReturnValue({
				id: 'appealId'
			});
			await postEnterCode(req, res);
			expect(res.render).toBeCalledWith(`${TASK_LIST}`);
			expect(req.session.appeal).toEqual({ id: 'appealId' });
		});
	});
});
