const {
	postCommentsQuestion
} = require('../../../../src/controllers/final-comment/comments-question');
const { mockReq, mockRes } = require('../../mocks');

describe('controllers/final-comment/comments-question', () => {
	let req;
	let res;

	beforeEach(() => {
		// mockReq by default sets an appeal field and places appeal object in session
		// so pass null and clear req.session to use for final comments
		req = {
			...mockReq(null),
			session: {}
		};
		res = mockRes();

		jest.resetAllMocks();
	});
	describe('postCommentsQuestion', () => {
		it('sets session correctly when comments-question yes', async () => {
			req.body = { 'comments-question': 'yes' };
			await postCommentsQuestion(req, res);
			expect(req.session.finalComment.hasComment).toBe(true);
		});
		it('sets session correctly when comments-question no', async () => {
			req.body = { 'comments-question': 'no' };
			await postCommentsQuestion(req, res);
			expect(req.session.finalComment.hasComment).toBe(false);
		});
	});
});
