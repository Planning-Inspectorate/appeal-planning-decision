jest.mock('../../../src/lib/appeals-api-wrapper');

const { mockReq, mockRes } = require('../mocks');
const fetchExistingAppealMiddleware = require('../../../src/middleware/fetch-existing-appeal');
const { getExistingAppeal } = require('../../../src/lib/appeals-api-wrapper');
const config = require('../../../src/config');
const { EMPTY_APPEAL } = require('../../../src/lib/appeals-api-wrapper');

config.appeals.url = 'http://fake.url';

describe('middleware/fetch-existing-appeal', () => {
  [
    {
      title: 'call next immediately if no session',
      given: () => mockReq,
      expected: (req, res, next) => {
        expect(getExistingAppeal).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
      },
    },
    {
      title: 'set empty appeal and call next immediately if no appeal exists',
      given: () => ({
        ...mockReq(null),
      }),
      expected: (req, res, next) => {
        expect(getExistingAppeal).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
      },
    },
    {
      title: 'set empty appeal and call next immediately if no id set',
      given: () => ({
        ...mockReq(),
      }),
      expected: (req, res, next) => {
        expect(getExistingAppeal).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
      },
    },
    {
      title: 'call next if api lookup fails',
      given: () => {
        getExistingAppeal.mockRejectedValue('API is down');
        return {
          ...mockReq(),
          session: {
            appeal: {
              id: '123-abc',
            },
          },
        };
      },
      expected: (req, res, next) => {
        expect(getExistingAppeal).toHaveBeenCalledWith('123-abc');
        expect(next).toHaveBeenCalled();
        expect(req.session.appeal).toEqual(JSON.parse(JSON.stringify(EMPTY_APPEAL)));
      },
    },
    {
      title: 'set session.appeal and call next if api call succeeds',
      given: () => {
        getExistingAppeal.mockResolvedValue({ good: 'data' });

        return {
          ...mockReq(),
          session: {
            appeal: {
              id: '123-abc',
            },
          },
        };
      },
      expected: (req, res, next) => {
        expect(getExistingAppeal).toHaveBeenCalledWith('123-abc');
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
