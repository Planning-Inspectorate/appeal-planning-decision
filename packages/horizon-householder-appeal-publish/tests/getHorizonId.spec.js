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
    const mockAppealAPIObject = { appealRes: { data: { horizonId: expectedHorizonId } } };
    axios.get.mockResolvedValue(mockAppealAPIObject);
    expect(await getHorizonId(appealId)).toEqual(expectedHorizonId);
  });

  it('should log an error', async () => {
    axios.get.mockRejectedValue('error');
    const horizonId = await getHorizonId(appealId);
    expect(logger.error).toHaveBeenCalledWith({ err: 'error' }, 'Unable to retrieve appeal data.');
    expect(horizonId).toEqual(0);
  });
});
