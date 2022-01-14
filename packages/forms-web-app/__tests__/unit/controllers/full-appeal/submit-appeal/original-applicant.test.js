const originalApplicantController = require('../../../../../src/controllers/full-appeal/submit-appeal/original-applicant');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const logger = require('../../../../../src/lib/logger');
const { APPEAL_DOCUMENT } = require('../../../../../src/lib/empty-appeal');
const { VIEW } = require('../../../../../src/lib/full-appeal/views');
const { mockReq, mockRes } = require('../../../mocks');
const { getTaskStatus } = require('../../../../../src/services/task.service');

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/services/task.service');
jest.mock('../../../../../src/lib/logger');

const { FORM_FIELD } = originalApplicantController;

const sectionName = 'aboutYouSection';
const taskName = 'yourDetails';

describe('controllers/full-appeal/submit-appeal/original-applicant', () => {
  let req;
  let res;
  let appeal;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();

    ({ empty: appeal } = APPEAL_DOCUMENT);

    jest.resetAllMocks();
  });

  describe('getOriginalApplicant', () => {
    it('should call the correct template', () => {
      originalApplicantController.getOriginalApplicant(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.FULL_APPEAL.ORIGINAL_APPLICANT, {
        FORM_FIELD,
        appeal: req.session.appeal,
      });
    });
  });

  describe('postOriginalApplicant', () => {
    it('should redirect with original-appellant set to true', async () => {
      const fakeTaskStatus = 'FAKE_STATUS';

      getTaskStatus.mockImplementation(() => fakeTaskStatus);

      const mockRequest = {
        ...mockReq(appeal),
        body: {
          'original-application-your-name': 'yes',
          errors: {},
          errorSummary: {},
        },
      };

      await originalApplicantController.postOriginalApplicant(mockRequest, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...appeal,
        [sectionName]: {
          ...appeal[sectionName],
          [taskName]: {
            appealingOnBehalfOf: '',
            email: null,
            isOriginalApplicant: true,
            name: null,
          },
        },
        sectionStates: {
          ...appeal.sectionStates,
          [sectionName]: {
            ...appeal.sectionStates[sectionName],
            [taskName]: fakeTaskStatus,
          },
        },
      });

      expect(res.render).not.toHaveBeenCalled();

      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.FULL_APPEAL.CONTACT_DETAILS}`);
    });

    it('should redirect with original-appellant set to false', async () => {
      const mockRequest = {
        ...mockReq(appeal),
        body: {
          'original-application-your-name': 'no',
          errors: {},
          errorSummary: {},
        },
      };

      await originalApplicantController.postOriginalApplicant(mockRequest, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);

      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.FULL_APPEAL.APPLICANT_NAME}`);
    });

    it('should re-render the template with errors if there is any validator error', async () => {
      const mockRequest = {
        ...mockReq(appeal),
        body: {
          'original-application-your-name': true,
          errors: { a: 'b' },
          errorSummary: [{ text: 'There were errors here', href: '#' }],
        },
      };
      await originalApplicantController.postOriginalApplicant(mockRequest, res);

      expect(createOrUpdateAppeal).not.toHaveBeenCalled();

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(VIEW.FULL_APPEAL.ORIGINAL_APPLICANT, {
        FORM_FIELD,
        appeal,
        errorSummary: [{ text: 'There were errors here', href: '#' }],
        errors: { a: 'b' },
      });
    });

    it('should re-render the template with errors if there is any api call error', async () => {
      const fakeTaskStatus = 'FAKE_STATUS';

      getTaskStatus.mockImplementation(() => fakeTaskStatus);

      const mockRequest = {
        ...mockReq(appeal),
        body: {},
      };

      const error = new Error('Cheers');
      createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

      await originalApplicantController.postOriginalApplicant(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();

      expect(logger.error).toHaveBeenCalledWith(error);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...appeal,
        [sectionName]: {
          ...appeal[sectionName],
          [taskName]: {
            appealingOnBehalfOf: '',
            email: null,
            isOriginalApplicant: undefined,
            name: null,
          },
        },
        sectionStates: {
          ...appeal.sectionStates,
          [sectionName]: {
            ...appeal.sectionStates[sectionName],
            [taskName]: fakeTaskStatus,
          },
        },
      });

      expect(res.render).toHaveBeenCalledWith(VIEW.FULL_APPEAL.ORIGINAL_APPLICANT, {
        FORM_FIELD,
        appeal: mockRequest.session.appeal,
        errorSummary: [{ text: error.toString(), href: '#' }],
        errors: {},
      });
    });
  });
});
