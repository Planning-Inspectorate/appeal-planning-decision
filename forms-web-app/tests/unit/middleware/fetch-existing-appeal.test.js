const fetch = require('node-fetch');
const { mockReq, mockRes } = require('../mocks');
const fetchExistingAppealMiddleware = require('../../../src/middleware/fetch-existing-appeal');
const config = require('../../../src/config');

config.APPEALS_SERVICE_API_URL = 'http://fake.url';

describe('middleware/fetch-existing-appeal', () => {
  beforeEach(() => {
    fetch.resetMocks();
  });

  [
    {
      title: 'call next immediately if no session',
      given: () => mockReq,
      expected: (req, res, next) => {
        expect(fetch).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
      },
    },
    {
      title: 'call next immediately if no uuid set',
      given: () => ({
        ...mockReq(),
        session: {},
      }),
      expected: (req, res, next) => {
        expect(fetch).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
      },
    },
    {
      title: 'call next if api lookup fails',
      given: () => {
        // eslint-disable-next-line prefer-promise-reject-errors
        fetch.mockReject(() => Promise.reject('API is down'));

        return {
          ...mockReq(),
          session: {
            uuid: '123-abc',
          },
        };
      },
      expected: (req, res, next) => {
        expect(fetch).toHaveBeenCalledWith(`${config.APPEALS_SERVICE_API_URL}/appeals/123-abc`);
        expect(next).toHaveBeenCalled();
        expect(req.session.appeal).toEqual({});
      },
    },
    {
      title: 'set session.appeal and call next if api call succeeds',
      given: () => {
        // eslint-disable-next-line prefer-promise-reject-errors
        fetch.mockResponseOnce(JSON.stringify({ good: 'data' }));

        return {
          ...mockReq(),
          session: {
            uuid: '123-abc',
          },
        };
      },
      expected: (req, res, next) => {
        expect(fetch).toHaveBeenCalledWith(`${config.APPEALS_SERVICE_API_URL}/appeals/123-abc`);
        expect(next).toHaveBeenCalled();
        expect(req.session.appeal).toEqual({ good: 'data' });
      },
    },
  ].forEach(({ title, given, expected }) => {
    it(title, async () => {
      const next = jest.fn();
      const req = given();

      await fetchExistingAppealMiddleware(req, mockRes, next);

      expected(req, mockRes, next);
    });
  });
});
