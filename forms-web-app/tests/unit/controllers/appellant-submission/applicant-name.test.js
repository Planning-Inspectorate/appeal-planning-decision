const applicantNameController = require('../../../../src/controllers/appellant-submission/applicant-name');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const { VIEW } = require('../../../../src/lib/views');
const logger = require('../../../../src/lib/logger');
const { EMPTY_APPEAL } = require('../../../../src/lib/appeals-api-wrapper');
const { mockReq, mockRes } = require('../../mocks');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/lib/logger');

const req = mockReq();
const res = mockRes();

const sectionName = 'aboutYouSection';
const taskName = 'yourDetails';

describe('controller/appellant-submission/applicant-name', () => {
  describe('getApplicantName', () => {
    it('should call the correct template', () => {
      applicantNameController.getApplicantName(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.APPLICANT_NAME, {
        appeal: req.session.appeal,
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
          errorSummary: [{ text: 'There were errors here', href: '#' }],
        },
      };
      await applicantNameController.postApplicantName(mockRequest, res);

      const appeal = JSON.parse(JSON.stringify(EMPTY_APPEAL));
      appeal[sectionName][taskName].appealingOnBehalfOf = 'Jim Jacobson';

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.APPLICANT_NAME, {
        appeal,
        errorSummary: [{ text: 'There were errors here', href: '#' }],
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
      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.APPLICANT_NAME, {
        appeal: req.session.appeal,
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it('should redirect to the task list', async () => {
      createOrUpdateAppeal.mockImplementation(() => JSON.stringify({ good: 'data' }));
      const mockRequest = {
        ...req,
        body: {
          'behalf-appellant-name': 'Jim Jacobson',
        },
      };

      const task = mockRequest.session.appeal[sectionName][taskName];
      task.isOriginalApplicant = false;
      task.name = 'Impostor';
      task.email = 'Impostor@gmail.com';
      task.appealingOnBehalfOf = 'Jim Jacobson';

      await applicantNameController.postApplicantName(mockRequest, res);

      const appeal = JSON.parse(JSON.stringify(EMPTY_APPEAL));
      appeal[sectionName][taskName].isOriginalApplicant = false;
      appeal[sectionName][taskName].name = 'Impostor';
      appeal[sectionName][taskName].email = 'Impostor@gmail.com';
      appeal[sectionName][taskName].appealingOnBehalfOf = 'Jim Jacobson';
      appeal.sectionStates[sectionName][taskName] = 'COMPLETED';

      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.APPELLANT_SUBMISSION.TASK_LIST}`);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
    });
  });
});
