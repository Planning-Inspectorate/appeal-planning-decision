const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const yourDetailsController = require('../../../../src/controllers/appellant-submission/your-details');
const { mockReq, mockRes } = require('../../mocks');
const { VIEW } = require('../../../../src/lib/views');
const logger = require('../../../../src/lib/logger');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/lib/logger');

const req = mockReq();
const res = mockRes();

describe('controller/appellant-submission/your-details', () => {
  describe('getYourDetails', () => {
    it('should call the correct template', () => {
      yourDetailsController.getYourDetails(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.YOUR_DETAILS, {
        appeal: undefined,
      });
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
      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.YOUR_DETAILS, {
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

    it('should redirect to task list if valid and original appellant', async () => {
      createOrUpdateAppeal.mockResolvedValue({});

      const mockRequest = {
        ...req,
        body: {},
      };

      mockRequest.session.appeal = {
        'original-appellant': true,
        'behalf-appellant-name': 'Impostor',
      };

      await yourDetailsController.postYourDetails(mockRequest, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        'original-appellant': true,
        'behalf-appellant-name': null,
        'appellant-email': undefined,
        'appellant-name': undefined,
      });
      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.APPELLANT_SUBMISSION.TASK_LIST}`);
    });

    it('should redirect to the applicant name page if valid and not the original appellant', async () => {
      createOrUpdateAppeal.mockResolvedValue({});

      req.session.appeal = {
        'original-appellant': false,
        'behalf-appellant-name': 'Impostor',
      };
      const mockRequest = {
        ...req,
        body: {
          'appellant-email': 'jim@joe.com',
          'appellant-name': 'Jim Joe',
        },
      };

      await yourDetailsController.postYourDetails(mockRequest, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        'original-appellant': false,
        'behalf-appellant-name': 'Impostor',
        'appellant-email': 'jim@joe.com',
        'appellant-name': 'Jim Joe',
      });
      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.APPELLANT_SUBMISSION.APPLICANT_NAME}`);
    });
  });
});
