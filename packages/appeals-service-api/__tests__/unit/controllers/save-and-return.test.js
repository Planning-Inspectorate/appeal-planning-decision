const { mockReq, mockRes } = require('../mocks');
const {
	saveAndReturnCreate,
	saveAndReturnGet,
	saveAndReturnToken
} = require('../../../src/controllers/save');
const { replaceAppeal } = require('../../../src/services/appeal.service');
const {
  saveAndReturnNotifyContinue,
  saveAndReturnCreateService,
  saveAndReturnTokenService,
  saveAndReturnGetServiceToken,
} = require('../../../src/services/save-and-return.service');

jest.mock('../../../src/services/save-and-return.service');
jest.mock('../../../src/services/appeal.service');
jest.mock('../../../../common/src/lib/notify/notify-builder', () => ({}));

describe('Save And Return API', () => {
	let req;
	let res;

	beforeEach(() => {
		req = mockReq();
		res = mockRes();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	describe('POST - create and send save and return', () => {
		it('should respond with - OK 200', async () => {
			const appealStub = {
				id: '1233123123'
			};
			req.body = appealStub;

			replaceAppeal.mockReturnValue(appealStub);
			saveAndReturnNotifyContinue.mockReturnValue('');
			saveAndReturnCreateService.mockReturnValue('12345');

			await saveAndReturnCreate(req, res);
			expect(saveAndReturnCreateService).toHaveBeenCalledWith(req.body);
			expect(res.status).toHaveBeenCalledWith(201);
		});

		it('should respond with - ERROR 400 when appealId is null', async () => {
			req.body = { appealId: null };

			saveAndReturnNotifyContinue.mockReturnValue('12345');
			saveAndReturnCreateService.mockReturnValue('12345');

			await expect(async () => saveAndReturnCreate(req, res)).rejects.toThrowError('');
			expect(res.status).toHaveBeenCalledWith(400);
			expect(saveAndReturnNotifyContinue).toBeCalledTimes(0);
			expect(saveAndReturnCreateService).toBeCalledTimes(0);
		});
	});

  describe('GET - get saved appeal', () => {
    it('should retrieve saved appeal by appealId', async () => {
      req.params = { token: '12345' };
      saveAndReturnGetServiceToken.mockReturnValue({ appealId: '12345' });
      await saveAndReturnGet(req, res);
      expect(saveAndReturnGetServiceToken).toHaveBeenCalledWith('12345');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({ appealId: '12345' });
    });
  });

	describe('PATCH - generate token and send it to email', () => {
		it('should generate the token and send it by email', async () => {
			req.body = { appealId: '12345' };
			saveAndReturnTokenService.mockReturnValue({ appealId: '12345' });
			await saveAndReturnToken(req, res);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.send).toHaveBeenCalledWith({ appealId: '12345' });
		});
	});
});
