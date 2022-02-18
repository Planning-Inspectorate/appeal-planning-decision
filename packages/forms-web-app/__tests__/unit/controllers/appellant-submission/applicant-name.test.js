const appeal = require('@pins/business-rules/test/data/householder-appeal');
const applicantNameController = require('../../../../src/controllers/appellant-submission/applicant-name');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const { VIEW } = require('../../../../src/lib/views');
const logger = require('../../../../src/lib/logger');
const { getTaskStatus, getNextTask } = require('../../../../src/services/task.service');
const { mockReq, mockRes } = require('../../mocks');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/services/task.service');
jest.mock('../../../../src/lib/logger');

const sectionName = 'aboutYouSection';
const taskName = 'yourDetails';

describe('controllers/appellant-submission/applicant-name', () => {
  let req;
  let res;

  beforeEach(() => {
    req = mockReq(appeal);
    res = mockRes();

    jest.resetAllMocks();
  });

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
      const fakeBehalfAppellantName = 'Jim Jacobson';
      const mockRequest = {
        ...req,
        body: {
          'behalf-appellant-name': fakeBehalfAppellantName,
          errors: { a: 'b' },
          errorSummary: [{ text: 'There were errors here', href: '#' }],
        },
      };

      await applicantNameController.postApplicantName(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();

      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.APPLICANT_NAME, {
        appeal: req.session.appeal,
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

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);

      expect(res.redirect).not.toHaveBeenCalled();

      expect(logger.error).toHaveBeenCalledWith(error);

      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.APPLICANT_NAME, {
        appeal: req.session.appeal,
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it('should redirect to the task list if valid', async () => {
      const fakeTaskStatus = 'FAKE_STATUS';

      getTaskStatus.mockImplementation(() => fakeTaskStatus);

      getNextTask.mockReturnValue({
        href: `/${VIEW.APPELLANT_SUBMISSION.TASK_LIST}`,
      });
      const mockRequest = {
        ...req,
        body: {
          'behalf-appellant-name': 'Jim Jacobson',
        },
      };

      await applicantNameController.postApplicantName(mockRequest, res);

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...appeal,
        sectionStates: {
          ...appeal.sectionStates,
          [sectionName]: {
            ...appeal.sectionStates[sectionName],
            [taskName]: fakeTaskStatus,
          },
        },
      });

      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.APPELLANT_SUBMISSION.TASK_LIST}`);
    });
  });
});
