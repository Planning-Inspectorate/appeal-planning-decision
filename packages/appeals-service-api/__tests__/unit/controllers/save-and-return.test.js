const { mockReq, mockRes } = require('../mocks');
const { saveAndReturnCreate } = require('../../../src/controllers/save-and-return');
const {
  createToken,
  saveAndReturnNotify,
  saveAndReturnCreateService,
} = require('../../../src/services/save-and-return.service');

jest.mock('../../../src/services/save-and-return.service');
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

  describe('create and send save and return', () => {
    it('should respond with - OK 200', async () => {
      req.body = { appealId: '123345', lastPage: 'page', token: '12345' };

      createToken.mockReturnValue('12345');
      saveAndReturnNotify.mockReturnValue('12345');
      saveAndReturnCreateService.mockReturnValue('12345');

      await saveAndReturnCreate(req, res);
      expect(createToken).toHaveBeenCalled();
      expect(saveAndReturnNotify).toHaveBeenCalledWith(req.body.token);
      expect(saveAndReturnCreateService).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should respond with - ERROR 400 when appealId is null', async () => {
      req = { appealId: null };

      createToken.mockReturnValue('12345');
      saveAndReturnNotify.mockReturnValue('12345');
      saveAndReturnCreateService.mockReturnValue('12345');

      await expect(async () => saveAndReturnCreate(req, res)).rejects.toThrowError('');
      expect(createToken).toBeCalledTimes(0);
      expect(saveAndReturnNotify).toBeCalledTimes(0);
      expect(saveAndReturnCreateService).toBeCalledTimes(0);
    });
  });
});
