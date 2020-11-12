const { createOrUpdateAppeal } = require('../../../src/lib/appeals-api-wrapper');
const yourDetailsController = require('../../../src/controllers/your-details');
const { mockReq, mockRes } = require('../mocks');
const logger = require('../../../src/lib/logger');

jest.mock('../../../src/lib/appeals-api-wrapper');
jest.mock('../../../src/lib/logger');

const req = mockReq();
const res = mockRes();

describe('controller/your-details', () => {
  describe('getYourDetails', () => {
    it('should call the correct template', () => {
      yourDetailsController.getYourDetails(req, res);

      expect(res.render).toHaveBeenCalledWith('your-details/index', { appeal: undefined });
    });
  });

  describe('postYourDetails', () => {
    it('should re-render the template with errors if submission validation fails', async () => {
      const mockRequest = {
        ...req,
        body: {
          errors: { a: 'b' },
          errorSummary: { a: { msg: 'There were errors here' } },
        },
      };
      await yourDetailsController.postYourDetails(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith('your-details/index', {
        appeal: { 'appellant-email': undefined, 'appellant-name': undefined },
        errorSummary: { a: { msg: 'There were errors here' } },
        errors: { a: 'b' },
      });
    });

    it('should log an error if the api call fails, and remain on the same page', async () => {
      const error = new Error('API is down');
      createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));
      const mockRequest = {
        ...req,
        body: {},
      };
      await yourDetailsController.postYourDetails(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalledWith(error);
    });

    it('should redirect if valid', async () => {
      createOrUpdateAppeal.mockImplementation(() => JSON.stringify({ good: 'data' }));

      const mockRequest = {
        ...req,
        body: {},
      };

      await yourDetailsController.postYourDetails(mockRequest, res);

      expect(res.redirect).toHaveBeenCalledWith('/application-number');
    });
  });
});
