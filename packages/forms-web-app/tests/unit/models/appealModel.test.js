const { getAppeal } = require('../../../src/models/appealModel');
const { get } = require('../../../src/apis/appealsApi');

jest.mock('../../../src/apis/appealsApi');

describe('models/appealModel', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getAppeal', () => {
    it('should call appealsApi as expected', async () => {
      const appealId = '12345678-abcdefgh-987654321';
      await getAppeal(appealId);

      expect(get).toHaveBeenCalledWith({
        url: `/api/v1/appeals/${appealId}`,
        route: '/appeals/:appealId',
      });
    });

    it('should return appeal as rececived from Api', async () => {
      const appeal = { id: '12345678-abcdefgh-987654321' };
      get.mockResolvedValue(appeal);
      const returnedAppeal = await getAppeal(appeal.id);

      expect(returnedAppeal).toEqual(appeal);
    });

    it('should throw any error returned from Api', async () => {
      const error = { status: 404 };
      get.mockRejectedValue(error);
      try {
        await getAppeal('12345678-abcdefgh-987654321');
      } catch (e) {
        expect(e).toEqual(error);
      }
    });
  });
});
