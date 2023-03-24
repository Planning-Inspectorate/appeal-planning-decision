const {
	getAppealClosedForComment
} = require('../../../../src/controllers/final-comment/appeal-closed-for-comment');
const {
	VIEW: {
		FINAL_COMMENT: { APPEAL_CLOSED_FOR_COMMENT }
	}
} = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');

describe('controllers/final-comment/appeal-closed-for-comment', () => {
	let req;
	let res;
	beforeEach(() => {
		req = mockReq();
		res = mockRes();
		jest.resetAllMocks();
	});
	describe('getAppealClosedForComment', () => {
		it('should render the appeal closed for comment page', async () => {
			await getAppealClosedForComment(req, res);

			expect(res.render).toBeCalledWith(APPEAL_CLOSED_FOR_COMMENT);
		});
	});
});
