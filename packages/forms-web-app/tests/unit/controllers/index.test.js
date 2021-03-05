const { mockReq, mockRes } = require('../mocks');

const req = mockReq();
const res = mockRes();

describe('controllers/index', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  describe('getIndex', () => {
    it('should redirect to the expected route - when process.env.SERVER_LIMITED_ROUTING_ENABLED is undefined', () => {
      // eslint-disable-next-line global-require
      const indexController = require('../../../src/controllers');
      indexController.getIndex(req, res);

      expect(res.redirect).toHaveBeenCalledWith('/before-you-appeal');
    });

    it('should redirect to the expected route - when process.env.SERVER_LIMITED_ROUTING_ENABLED is true - ACP mode', () => {
      process.env.SERVER_LIMITED_ROUTING_ENABLED = 'true';

      // eslint-disable-next-line global-require
      const indexController = require('../../../src/controllers');
      indexController.getIndex(req, res);

      expect(res.redirect).toHaveBeenCalledWith('/eligibility/decision-date');
    });

    it('should redirect to the expected route - when process.env.SERVER_LIMITED_ROUTING_ENABLED is false - Not in ACP mode', () => {
      process.env.SERVER_LIMITED_ROUTING_ENABLED = 'false';

      // eslint-disable-next-line global-require
      const indexController = require('../../../src/controllers');
      indexController.getIndex(req, res);

      expect(res.redirect).toHaveBeenCalledWith('/before-you-appeal');
    });
  });
});
