const { mockReq, mockRes } = require('../mocks');
const indexController = require('../../../src/controllers');
const { isFeatureActive } = require('../../../src/featureFlag');

let req;
let res;

jest.mock('../../../src/featureFlag');

describe('controllers/index', () => {
	beforeEach(() => {
		req = mockReq();
		res = mockRes();
		jest.resetAllMocks();
		isFeatureActive.mockResolvedValue(true);
	});

	describe('getIndex', () => {
		it('should redirect to the expected route when isEnrolUsers flag is true', async () => {
			await indexController.getIndex(req, res);

			expect(res.redirect).toHaveBeenCalledWith('/appeal/new-saved-appeal');
		});

		it('should redirect to the expected route when isEnrolUsers flag is false', async () => {
			isFeatureActive.mockResolvedValue(false);

			await indexController.getIndex(req, res);

			expect(res.redirect).toHaveBeenCalledWith('/before-you-start');
		});
	});
});
