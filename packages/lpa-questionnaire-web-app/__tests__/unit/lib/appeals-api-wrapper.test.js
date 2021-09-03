jest.mock('uuid');

const fetch = require('node-fetch');
const { getAppeal } = require('../../../src/lib/appeals-api-wrapper');

const config = require('../../../src/config');

const mockLogger = jest.fn();

jest.mock('../../../src/lib/logger', () => ({
  child: () => ({
    debug: mockLogger,
    error: mockLogger,
    warn: mockLogger,
  }),
}));

config.appeals.url = 'http://fake.url';

describe('lib/appeals-api-wrapper', () => {
  beforeEach(() => {
    fetch.resetMocks();
    fetch.doMock();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('getAppeal', () => {
    it('should call the expected URL', async () => {
      fetch.mockResponseOnce(JSON.stringify({ shouldBe: 'valid' }));
      await getAppeal('123');
      expect(fetch.mock.calls[0][0]).toEqual('http://fake.url/api/v1/appeals/123');
    });

    it('should return an error if there is a problem contacting then API', async () => {
      fetch.mockRejectedValueOnce('API is down');
      try {
        await getAppeal('123');
      } catch (e) {
        expect(e).toEqual('API is down');
      }
    });
  });
});
