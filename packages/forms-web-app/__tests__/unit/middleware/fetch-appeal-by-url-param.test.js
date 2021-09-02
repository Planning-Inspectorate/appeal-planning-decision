const logger = require('../../../src/lib/logger');
const { mockReq, mockRes } = require('../mocks');
const fetchAppealByUrlParamMiddleware = require('../../../src/middleware/fetch-appeal-by-url-param');
const { getExistingAppeal } = require('../../../src/lib/appeals-api-wrapper');
const config = require('../../../src/config');

jest.mock('../../../src/lib/appeals-api-wrapper');
jest.mock('../../../src/lib/logger');

config.appeals.url = 'http://fake.url';

const createBaseRequest = () => ({
  ...mockReq(),
  session: {},
  params: {},
});

describe('middleware/fetch-appeal-by-url-param', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  [
    {
      title: 'req.params[appealKey] is undefined',
      setup: () => ({
        appealKey: undefined,
        req: createBaseRequest(),
      }),
      expected: (req, res, next) => {
        expect(req.session.appeal).toBeUndefined();
        expect(getExistingAppeal).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
      },
    },
    {
      title: 'req.params[appealKey] is not found in req.params',
      setup: () => ({
        appealKey: 'some-key',
        req: createBaseRequest(),
      }),
      expected: (req, res, next) => {
        expect(req.session.appeal).toBeUndefined();
        expect(getExistingAppeal).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
      },
    },
    {
      title: 'req.params[appealKey] is found but value is undefined',
      setup: () => ({
        appealKey: 'aKey',
        req: {
          ...createBaseRequest(),
          params: {
            aKey: undefined,
          },
        },
      }),
      expected: (req, res, next) => {
        expect(req.session.appeal).toBeUndefined();
        expect(getExistingAppeal).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
      },
    },
    {
      title: 'req.params[appealKey] is found but getExistingAppeal fails',
      setup: () => {
        getExistingAppeal.mockRejectedValue(new Error('fake error message'));
        return {
          appealKey: 'aKey',
          req: {
            ...createBaseRequest(),
            params: {
              aKey: '123-abc',
            },
          },
        };
      },
      expected: (req, res, next) => {
        expect(req.session.appeal).toBeUndefined();
        expect(getExistingAppeal).toHaveBeenCalledWith('123-abc');
        expect(logger.debug.mock.calls.length).toEqual(2);
        expect(logger.debug.mock.calls[0][0]).toEqual(
          {
            id: '123-abc',
          },
          `Get existing appeal from req.params[aKey]`
        );
        expect(logger.debug.mock.calls[1][0]).toEqual(
          { err: new Error('fake error message') },
          `Error retrieving appeal using req.params[aKey]`
        );
        expect(next).toHaveBeenCalled();
      },
    },
    {
      title: 'req.params[appealKey] is found and getExistingAppeal succeeds',
      setup: () => {
        getExistingAppeal.mockResolvedValue({ good: 'data' });
        return {
          appealKey: 'aKey',
          req: {
            ...createBaseRequest(),
            params: {
              aKey: '123-abc',
            },
          },
        };
      },
      expected: (req, res, next) => {
        expect(getExistingAppeal).toHaveBeenCalledWith('123-abc');
        expect(logger.debug.mock.calls.length).toEqual(1);
        expect(logger.debug.mock.calls[0][0]).toEqual(
          {
            id: '123-abc',
          },
          `Get existing appeal from req.params[aKey]`
        );
        expect(req.session.appeal).toEqual({ good: 'data' });
        expect(next).toHaveBeenCalled();
      },
    },
  ].forEach(({ title, setup, expected }) => {
    test(title, async () => {
      const next = jest.fn();
      const { appealKey, req } = setup();

      await fetchAppealByUrlParamMiddleware(appealKey)(req, mockRes, next);

      expected(req, mockRes, next);
    });
  });
});
