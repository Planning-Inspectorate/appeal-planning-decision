const applicantNameController = require('../../../../src/controllers/appellant-submission/applicant-name');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const { VIEW } = require('../../../../src/lib/views');
const logger = require('../../../../src/lib/logger');
const { mockReq, mockRes } = require('../../mocks');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/lib/logger');

const req = mockReq();
const res = mockRes();

describe('controller/appellant-submission/applicant-name', () => {
  describe('getApplicantName', () => {
    it('should call the correct template', () => {
      applicantNameController.getApplicantName(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.APPLICANT_NAME, {
        appeal: undefined,
      });
    });
  });

  describe('postApplicantName', () => {
    it('should re-render the template with errors if there is any validator error', async () => {
      const mockRequest = {
        ...req,
        body: {
          'behalf-appellant-name': 'Jim Jacobson',
          errors: { a: 'b' },
          errorSummary: { a: { msg: 'There were errors here' } },
        },
      };
      await applicantNameController.postApplicantName(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.APPLICANT_NAME, {
        appeal: {
          'behalf-appellant-name': 'Jim Jacobson',
        },
        errorSummary: { a: { msg: 'There were errors here' } },
        errors: { a: 'b' },
      });
    });

    it('should re-render the template with errors if there is any api call error', async () => {
      const mockRequest = {
        ...req,
        body: {},
      };

      const error = new Error('Cheers');
      createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

      await applicantNameController.postApplicantName(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalledWith(error);
    });

    it('should redirect to the task list', async () => {
      createOrUpdateAppeal.mockImplementation(() => JSON.stringify({ good: 'data' }));
      const mockRequest = {
        ...req,
        body: {
          'behalf-appellant-name': 'Jim Jacobson',
        },
      };
      await applicantNameController.postApplicantName(mockRequest, res);

      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.APPELLANT_SUBMISSION.TASK_LIST}`);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        'behalf-appellant-name': 'Jim Jacobson',
      });
    });
  });
});
