const { mockReq, mockRes } = require('../mocks');
const debug = require('../../../src/controllers/debug');

describe('controllers/debug', () => {
	let req;
	let res;

	beforeEach(() => {
		jest.resetAllMocks();

		req = {
			...mockReq(),
			session: {},
			query: {}
		};
		res = mockRes();
	});

	describe('set-comment-deadline', () => {
		it('should 404 if given no deadline', () => {
			req.query.deadline = undefined;
			req.session.finalCommentOverrideExpiryDate = '123';

			debug.setCommentDeadline(req, res);

			expect(res.sendStatus).toHaveBeenCalledWith(400);
			expect(req.session.finalCommentOverrideExpiryDate).toEqual(undefined);
		});

		it('should 404 with bad deadline', () => {
			req.query.deadline = 'abc';
			req.session.finalCommentOverrideExpiryDate = '123';

			debug.setCommentDeadline(req, res);

			expect(res.sendStatus).toHaveBeenCalledWith(400);
			expect(req.session.finalCommentOverrideExpiryDate).toEqual(undefined);
		});

		it('should 200 if given deadline', () => {
			const mockDate = '2023-06-01T00:00:00Z';
			req.query.deadline = mockDate;

			debug.setCommentDeadline(req, res);

			expect(res.sendStatus).toHaveBeenCalledWith(200);
			expect(req.session.finalCommentOverrideExpiryDate).toEqual(new Date(mockDate));
		});
	});
});
