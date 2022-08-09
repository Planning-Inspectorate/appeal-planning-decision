const { mockReq, mockRes } = require('../../../mocks');

const {
	VIEW: {
		FULL_APPEAL: { LIST_OF_DOCUMENTS, TASK_LIST }
	}
} = require('../../../../../src/lib/full-appeal/views');
const {
	getListOfDocuments,
	postListOfDocuments
} = require('../../../../../src/controllers/full-appeal/submit-appeal/list-of-documents');

describe('controllers/full-appeal/submit-appeal/list-of-documents', () => {
	let req;
	let res;
	const url = '/full-appeal/submit-appeal/email-address-confirmed';

	beforeEach(() => {
		req = mockReq();
		res = mockRes();

		jest.resetAllMocks();
	});

	describe('getListOfDocuments', () => {
		it('should call the correct template', () => {
			getListOfDocuments(req, res);

			expect(res.render).toHaveBeenCalledWith(LIST_OF_DOCUMENTS);
		});
	});

	describe('postListOfDocuments', () => {
		it('should redirect to `/full-appeal/submit-appeal/task-list`', async () => {
			req.body = {};
			await postListOfDocuments(req, res);
			expect(res.redirect).toHaveBeenCalledWith(`/${TASK_LIST}`);
		});
	});
});
