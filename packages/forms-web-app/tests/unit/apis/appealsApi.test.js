const { request } = require('axios');
const config = require('../../../src/config');
const { get } = require('../../../src/apis/appealsApi');

jest.mock('axios');

describe('apis/appealsApi', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('get', () => {
    const params = {
      url: '/endpoint',
      route: '/endpoint',
      headers: { foo: 'bar' },
    };

    it('should call appealsApi as expected', async () => {
      request.mockResolvedValue({
        data: {},
      });
      await get(params);
      expect(request).toHaveBeenCalledWith({
        url: `${config.appeals.url}${params.url}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Correlation-ID': expect.any(String),
          ...params.headers,
        },
      });
    });

    it('should return the api response for a successfull call', async () => {
      request.mockResolvedValue({
        data: { value: 'value' },
      });
      const result = await get(params);

      expect(result).toEqual({ value: 'value' });
    });

    it('should return an api error for an usuccessfull call', async () => {
      const error = { status: 404 };
      request.mockRejectedValue(error);

      try {
        await get(params);
      } catch (err) {
        expect(err).toEqual(error);
      }
    });
  });
});
