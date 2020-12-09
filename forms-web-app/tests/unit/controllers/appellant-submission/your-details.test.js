const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const yourDetailsController = require('../../../../src/controllers/appellant-submission/your-details');
const { mockReq, mockRes } = require('../../mocks');
const { VIEW } = require('../../../../src/lib/views');
const logger = require('../../../../src/lib/logger');
const { EMPTY_APPEAL } = require('../../../../src/lib/appeals-api-wrapper');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/lib/logger');

const req = mockReq();
const res = mockRes();

const sectionName = 'aboutYouSection';
const taskName = 'yourDetails';

describe('controller/appellant-submission/your-details', () => {
  describe('getYourDetails', () => {
    it('should call the correct template', () => {
      yourDetailsController.getYourDetails(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.YOUR_DETAILS, {
        appeal: req.session.appeal,
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
        appeal: req.session.appeal,
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

      const task = mockRequest.session.appeal[sectionName][taskName];
      task.isOriginalApplicant = true;
      task.appealingOnBehalfOf = 'Impostor';

      await yourDetailsController.postYourDetails(mockRequest, res);

      const appeal = JSON.parse(JSON.stringify(EMPTY_APPEAL));
      appeal[sectionName][taskName].isOriginalApplicant = true;
      appeal[sectionName][taskName].appealingOnBehalfOf = null;
      appeal[sectionName][taskName].email = undefined;
      appeal[sectionName][taskName].name = undefined;
      appeal.sectionStates[sectionName][taskName] = 'IN PROGRESS';

      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);

      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.APPELLANT_SUBMISSION.TASK_LIST}`);
    });

    it('should redirect to the applicant name page if valid and not the original appellant', async () => {
      createOrUpdateAppeal.mockResolvedValue({});

      const mockRequest = {
        ...mockReq(),
        body: {
          'appellant-email': 'jim@joe.com',
          'appellant-name': 'Jim Joe',
        },
      };

      const task = mockRequest.session.appeal[sectionName][taskName];
      task.isOriginalApplicant = false;
      task.appealingOnBehalfOf = 'Impostor';

      await yourDetailsController.postYourDetails(mockRequest, res);

      const appeal = JSON.parse(JSON.stringify(EMPTY_APPEAL));
      appeal[sectionName][taskName].isOriginalApplicant = false;
      appeal[sectionName][taskName].appealingOnBehalfOf = 'Impostor';
      appeal[sectionName][taskName].email = 'jim@joe.com';
      appeal[sectionName][taskName].name = 'Jim Joe';
      appeal.sectionStates[sectionName][taskName] = 'COMPLETED';

      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);

      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.APPELLANT_SUBMISSION.APPLICANT_NAME}`);
    });
  });
});
