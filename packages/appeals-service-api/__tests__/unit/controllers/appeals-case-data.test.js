const { getAppealsByLpaCode } = require('../../../src/controllers/appeals-case-data');
const ApiError = require('../../../src/errors/apiError');
const { getAppeals } = require('../../../src/services/appeals-case-data.service');
const { mockReq, mockRes } = require('../mocks');

jest.mock('../../../src/services/appeals-case-data.service');

const req = mockReq();
const res = mockRes();

describe('../../../src/controllers/appeals-case-data', () => {
	beforeEach(async () => {
		jest.clearAllMocks();
	});
	describe('getAppealsByLpaCode', () => {
		it('should return 200 with result of successful call to getAppeals', async () => {
			req.params.lpaCode = 'Q9999';
			getAppeals.mockReturnValue({ test: 'test' });

			await getAppealsByLpaCode(req, res);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.send).toHaveBeenCalledWith({ test: 'test' });
		});

		it('should return error status and message if call to getAppeals fails', async () => {
			const error = ApiError.appealsCaseDataNotFound();
			req.params.lpaCode = 'Q9999';
			getAppeals.mockImplementation(() => {
				throw error;
			});

			await getAppealsByLpaCode(req, res);

			expect(res.status).toHaveBeenCalledWith(error.code);
			expect(res.send).toHaveBeenCalledWith(error.message.errors);
		});
	});
});
