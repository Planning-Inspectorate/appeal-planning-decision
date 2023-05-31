const { postDocumentsCheck } = require('../../../../src/controllers/final-comment/documents-check');
const { mockReq, mockRes } = require('../../mocks');
const finalComment = require('../../../mockData/final-comment');

describe('controllers/final-comment/documents-check', () => {
	let req;
	let res;

	beforeEach(() => {
		// mockReq by default sets an appeal field and places appeal object in session
		// so pass null and clear req.session to use for final comments
		req = {
			...mockReq(null),
			session: { finalComment }
		};

		res = mockRes();

		jest.resetAllMocks();
	});
	describe('postDocumentsCheck', () => {
		it('sets session correctly when documents-check yes', async () => {
			req.body = { 'documents-check': 'yes' };
			await postDocumentsCheck(req, res);
			expect(req.session.finalComment.hasSupportingDocuments).toBe(true);
		});
		it('sets session correctly when documents-check no', async () => {
			req.body = { 'documents-check': 'no' };
			await postDocumentsCheck(req, res);
			expect(req.session.finalComment.hasSupportingDocuments).toBe(false);
		});
	});
});
