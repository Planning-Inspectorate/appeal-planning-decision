const getPreviousPagePath = require('../../../src/lib/get-previous-page-path');

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

  const setupReqGetMock = ({ origin, referer }) => {
    get.mockImplementation((arg) => {
      switch (arg.toLowerCase()) {
        case 'origin':
          return origin;
        case 'referer':
          return referer;
        default:
          throw new Error(`Invalid: ${arg}`);
      }
    });
  };

  describe('unhappy path', () => {
    test(`origin not found`, () => {
      setupReqGetMock({ origin: undefined, referer: undefined });
      expect(getPreviousPagePath(req)).toEqual('/');
    });

    test(`referer not found`, () => {
      setupReqGetMock({ origin: 'something', referer: undefined });
      expect(getPreviousPagePath(req)).toEqual('/');
    });

    [
      {
        title: 'empty origin ',
        origin: '',
        referer: 'https://example.com/some/path/here',
      },
      {
        title: 'empty referer returns root url',
        origin: 'https://example.com',
        referer: '',
      },
      {
        title: 'referer and origin base urls do not match returns root url',
        origin: 'http://example.org',
        referer: 'https://example.com/some/path/here',
      },
    ].forEach(({ title, origin, referer }) => {
      test(`should return root url - ${title}`, () => {
        setupReqGetMock({ origin, referer });
        expect(getPreviousPagePath(req)).toEqual('/');
      });
    });
  });

  [
    {
      origin: 'https://example.com',
      referer: 'https://example.com/some',
      expected: '/some',
    },
    {
      origin: 'http://example.org',
      referer: 'http://example.org/some/nested/path?and=stuff',
      expected: '/some/nested/path?and=stuff',
    },
  ].forEach(({ origin, referer, expected }) => {
    test(`happy path - should return the expected path - ${expected}`, () => {
      setupReqGetMock({ origin, referer });
      expect(getPreviousPagePath(req)).toEqual(expected);
    });
  });
});
