const checkSaveAndReturnMiddleware = require('../../../src/middleware/check-save-and-return');
const { saveAppeal } = require('../../../src/lib/appeals-api-wrapper');
const logger = require('../../../src/lib/logger');

const {
  VIEW: {
    SUBMIT_APPEAL: { APPLICATION_SAVED },
  },
} = require('../../../src/lib/submit-appeal/views');

jest.mock('../../../src/lib/appeals-api-wrapper');
jest.mock('../../../src/lib/logger');

describe('middleware/check-save-and-return', () => {
  let req;
  const res = {
    redirect: jest.fn(),
  };
  const next = jest.fn();

  beforeEach(() => {
    req = {
      session: {
        appeal: 'data',
      },
      body: {},
    };
  });

  it('should call next if no save and return property in body', () => {
    checkSaveAndReturnMiddleware(req, res, next);
    expect(next).toBeCalled();
  });

  it('should call redirect if api call successful', async () => {
    req.body = { 'save-and-return': '' };
    saveAppeal.mockResolvedValue({});
    await checkSaveAndReturnMiddleware(req, res, next);
    expect(saveAppeal).toHaveBeenCalledWith('data');
    expect(res.redirect).toHaveBeenCalledWith(`/${APPLICATION_SAVED}`);
    expect(next).not.toHaveBeenCalled();
  });

  it('should log error and call next if api call unsuccessful', async () => {
    req.body = { 'save-and-return': '' };
    saveAppeal.mockRejectedValue('API fail');
    await checkSaveAndReturnMiddleware(req, res, next);
    expect(saveAppeal).toHaveBeenCalledWith('data');
    expect(res.redirect).not.toHaveBeenCalled();
    expect(logger.error).toHaveBeenCalledWith('API fail');
    expect(next).toHaveBeenCalled();
  });
});
