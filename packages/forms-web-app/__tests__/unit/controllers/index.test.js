const { mockReq, mockRes } = require('../mocks');
const indexController = require('../../../src/controllers');

let req;
let res;

jest.mock('../../../src/featureFlag');

describe('controllers/index', () => {
	beforeEach(() => {
		req = mockReq();
		res = mockRes();
		jest.resetAllMocks();
	});

	describe('getIndex', () => {
		it('should redirect to the expected route', async () => {
			await indexController.getIndex(req, res);

			expect(res.redirect).toHaveBeenCalledWith('/appeal/new-saved-appeal');
		});
	});
});
