const axios = require('axios');
const logger = require('../src/lib/logger');
const { getHorizonId } = require('../src/getHorizonId');

jest.mock('axios');

jest.mock('../src/lib/logger', () => ({
  error: jest.fn(),
  info: jest.fn(),
}));

describe('getHorizonId', () => {
  const appealId = 'mock-appeal-id';

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return a correct horizonId from an appealId', async () => {
    const expectedHorizonId = '3000001';
    const mockAppealAPIObject = { data: { horizonId: expectedHorizonId } };
    axios.get.mockResolvedValue(mockAppealAPIObject);
    expect(await getHorizonId(appealId)).toEqual(expectedHorizonId);
    expect(logger.info).toHaveBeenCalledWith(
      { horizonId: '3000001' },
      'Horizon ID obtained from Appeals Service API'
    );
  });

  it('should log an error', async () => {
    axios.get.mockRejectedValue('error');
    try {
      await getHorizonId(appealId);
    } catch (err) {
      expect(err.toString()).toEqual('Error: Current appeal does not contain Horizon ID');
      expect(logger.error).toHaveBeenCalledWith({ err: 'error' }, 'Unable to retrieve appeal data');
    }
  });
});
