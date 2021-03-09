const getBaseUrl = require('../../../src/lib/get-base-url');

describe('lib/get-base-url', () => {
  let req;
  let get;

  beforeEach(() => {
    get = jest.fn();

    req = {
      get,
    };
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const setupReqGetMock = ({ host }) => {
    get.mockImplementation((arg) => {
      switch (arg.toLowerCase()) {
        case 'host':
          return host;
        default:
          throw new Error(`Invalid: ${arg}`);
      }
    });
  };

  describe('unhappy path', () => {
    test(`req.protocol not defined`, () => {
      delete req.protocol;
      expect(getBaseUrl(req)).toEqual(undefined);
    });

    test(`host not defined`, () => {
      req.protocol = 'https';
      setupReqGetMock({ host: undefined });
      expect(getBaseUrl(req)).toEqual(undefined);
    });
  });

  [
    {
      protocol: 'http',
      host: 'example.com',
      expected: 'http://example.com',
    },
    {
      protocol: 'https',
      host: 'example.org',
      expected: 'https://example.org',
    },
  ].forEach(({ protocol, host, expected }) => {
    test(`happy path - should return the expected base url - ${expected}`, () => {
      req.protocol = protocol;
      setupReqGetMock({ host });
      expect(getBaseUrl(req)).toEqual(expected);
    });
  });
});
