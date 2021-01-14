const siteAccessSafetyController = require('../../../../src/controllers/appellant-submission/site-access-safety');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const { VIEW } = require('../../../../src/lib/views');
const logger = require('../../../../src/lib/logger');
const { getNextTask } = require('../../../../src/services/task.service');
const { mockReq, mockRes } = require('../../mocks');
const { APPEAL_DOCUMENT } = require('../../../../src/lib/empty-appeal');
const { getTaskStatus } = require('../../../../src/services/task.service');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/services/task.service');
jest.mock('../../../../src/lib/logger');

const sectionName = 'appealSiteSection';
const taskName = 'healthAndSafety';

describe('controllers/appellant-submission/site-access-safety', () => {
  let req;
  let res;
  let appeal;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();

    ({ empty: appeal } = APPEAL_DOCUMENT);

    jest.resetAllMocks();
  });

  describe('getSiteAccessSafety', () => {
    it('should call the correct template', () => {
      siteAccessSafetyController.getSiteAccessSafety(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.SITE_ACCESS_SAFETY, {
        appeal: req.session.appeal,
      });
    });
  });

  describe('postSiteAccessSafety', () => {
    it('should re-render the template with errors if there is any validation error', async () => {
      const mockRequest = {
        ...req,
        body: {
          'site-access-safety': 'bad value',
          errors: { a: 'b' },
          errorSummary: [{ text: 'There were errors here', href: '#' }],
        },
      };
      await siteAccessSafetyController.postSiteAccessSafety(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.SITE_ACCESS_SAFETY, {
        appeal: {
          ...req.session.appeal,
          [sectionName]: {
            ...req.session.appeal[sectionName],
            [taskName]: {
              hasIssues: null,
              healthAndSafetyIssues: null,
            },
          },
        },
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

      await siteAccessSafetyController.postSiteAccessSafety(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalledWith(error);
      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.SITE_ACCESS_SAFETY, {
        appeal: req.session.appeal,
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it('issues with concern - should redirect to the task list', async () => {
      const fakeTaskStatus = 'FAKE_STATUS';
      getTaskStatus.mockImplementation(() => fakeTaskStatus);

      getNextTask.mockReturnValue({
        href: `/${VIEW.APPELLANT_SUBMISSION.TASK_LIST}`,
      });
      const mockRequest = {
        ...req,
        body: {
          'site-access-safety': 'yes',
          'site-access-safety-concerns': 'some concerns noted here',
        },
      };
      await siteAccessSafetyController.postSiteAccessSafety(mockRequest, res);

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...appeal,
        [sectionName]: {
          ...appeal[sectionName],
          [taskName]: {
            hasIssues: true,
            healthAndSafetyIssues: 'some concerns noted here',
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

      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.APPELLANT_SUBMISSION.TASK_LIST}`);
    });

    [
      {
        description: 'basic expected payload',
        body: {
          'site-access-safety': 'no',
          'site-access-safety-concerns': '',
        },
      },
      {
        description:
          'acceptable submission, though safety concerns will be ignored when creating or updating the appeal',
        body: {
          'site-access-safety': 'no',
          'site-access-safety-concerns': 'some concerns noted here',
        },
      },
    ].forEach(({ description, body }) => {
      it(`no issues with concerns - should redirect to the task list - ${description}`, async () => {
        const fakeTaskStatus = 'ANOTHER_FAKE_STATUS';
        getTaskStatus.mockImplementation(() => fakeTaskStatus);

        getNextTask.mockReturnValue({
          href: `/${VIEW.APPELLANT_SUBMISSION.TASK_LIST}`,
        });
        const mockRequest = {
          ...mockReq(appeal),
          body,
        };
        await siteAccessSafetyController.postSiteAccessSafety(mockRequest, res);

        expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);

        expect(createOrUpdateAppeal).toHaveBeenCalledWith({
          ...appeal,
          [sectionName]: {
            ...appeal[sectionName],
            [taskName]: {
              hasIssues: false,
              healthAndSafetyIssues: '',
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

        expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.APPELLANT_SUBMISSION.TASK_LIST}`);
      });
    });
  });
});
