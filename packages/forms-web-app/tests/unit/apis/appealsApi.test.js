const { request } = require('axios');
const config = require('../../../src/config');
const { get, post, put, destroy } = require('../../../src/apis/appealsApi');

jest.mock('axios');

describe('apis/appealsApi', () => {
  const params = {
    url: '/endpoint',
    route: '/endpoint',
    headers: { foo: 'bar' },
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('get', () => {
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

    it('should call appealsApi as expected with no args', async () => {
      request.mockResolvedValue({
        data: {},
      });
      await get();
      expect(request).toHaveBeenCalledWith({
        url: `${config.appeals.url}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-Correlation-ID': expect.any(String),
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

  describe('post', () => {
    it('should call appealsApi as expected', async () => {
      request.mockResolvedValue({
        data: {},
      });
      await post(params);
      expect(request).toHaveBeenCalledWith({
        url: `${config.appeals.url}${params.url}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Correlation-ID': expect.any(String),
          ...params.headers,
        },
      });
    });
  });

  describe('put', () => {
    it('should call appealsApi as expected', async () => {
      request.mockResolvedValue({
        data: {},
      });
      await put(params);
      expect(request).toHaveBeenCalledWith({
        url: `${config.appeals.url}${params.url}`,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Correlation-ID': expect.any(String),
          ...params.headers,
        },
      });
    });
  });

  describe('destroy', () => {
    it('should call appealsApi as expected', async () => {
      request.mockResolvedValue({
        data: {},
      });
      await destroy(params);
      expect(request).toHaveBeenCalledWith({
        url: `${config.appeals.url}${params.url}`,
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-Correlation-ID': expect.any(String),
          ...params.headers,
        },
      });
    });
  });
});
