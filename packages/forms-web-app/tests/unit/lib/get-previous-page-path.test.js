const getPreviousPagePath = require('../../../src/lib/get-previous-page-path');
const getBaseUrl = require('../../../src/lib/get-base-url');

jest.mock('../../../src/lib/get-base-url');

describe('lib/get-previous-page-path', () => {
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

  const setupReqGetMock = ({ referer }) => {
    get.mockImplementation((arg) => {
      switch (arg.toLowerCase()) {
        case 'referer':
          return referer;
        default:
          throw new Error(`Invalid: ${arg}`);
      }
    });
  };

  [
    {
      title: 'referer undefined',
      baseUrl: 'https://example.org',
      referer: undefined,
    },
    {
      title: 'baseUrl undefined',
      baseUrl: undefined,
      referer: 'https://example.com/some/path/here',
    },
    {
      title: 'empty referer',
      baseUrl: 'https://example.com',
      referer: '',
    },
    {
      title: 'referer and base urls do not match',
      baseUrl: 'http://example.org',
      referer: 'https://example.com/some/path/here',
    },
  ].forEach(({ title, baseUrl, referer }) => {
    test(`unhappy path - should return root url - ${title}`, () => {
      getBaseUrl.mockImplementation(() => baseUrl);
      setupReqGetMock({ referer });
      expect(getPreviousPagePath(req)).toEqual('/');
    });
  });

  [
    {
      baseUrl: 'https://example.com',
      referer: 'https://example.com/some',
      expected: '/some',
    },
    {
      baseUrl: 'http://example.org',
      referer: 'http://example.org/some/nested/path?and=stuff',
      expected: '/some/nested/path?and=stuff',
    },
  ].forEach(({ baseUrl, referer, expected }) => {
    test(`happy path - should return the expected path - ${expected}`, () => {
      getBaseUrl.mockImplementation(() => baseUrl);
      setupReqGetMock({ referer });
      expect(getPreviousPagePath(req)).toEqual(expected);
    });
  });
});
