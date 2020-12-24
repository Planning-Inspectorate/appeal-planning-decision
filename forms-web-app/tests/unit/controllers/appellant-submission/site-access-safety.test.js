const siteAccessSafetyController = require('../../../../src/controllers/appellant-submission/site-access-safety');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const { VIEW } = require('../../../../src/lib/views');
const logger = require('../../../../src/lib/logger');
const { getNextUncompletedTask } = require('../../../../src/services/task.service');
const { mockReq, mockRes } = require('../../mocks');
const { APPEAL_DOCUMENT } = require('../../../../src/lib/empty-appeal');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/services/task.service');
jest.mock('../../../../src/lib/logger');

const req = mockReq();
const res = mockRes();

const sectionName = 'appealSiteSection';
const taskName = 'healthAndSafety';

describe('controller/appellant-submission/site-access-safety', () => {
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
      createOrUpdateAppeal.mockImplementation(() => JSON.stringify({ good: 'data' }));
      getNextUncompletedTask.mockReturnValue({
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

      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.APPELLANT_SUBMISSION.TASK_LIST}`);

      const { empty: appeal } = APPEAL_DOCUMENT;
      appeal[sectionName][taskName].hasIssues = true;
      appeal[sectionName][taskName].healthAndSafetyIssues = 'some concerns noted here';
      appeal.sectionStates[sectionName][taskName] = 'TODO';

      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
    });
    it('no issues with concerns - should redirect to the task list', async () => {
      createOrUpdateAppeal.mockImplementation(() => JSON.stringify({ good: 'data' }));
      getNextUncompletedTask.mockReturnValue({
        href: `/${VIEW.APPELLANT_SUBMISSION.TASK_LIST}`,
      });
      const mockRequest = {
        ...mockReq(),
        body: {
          'site-access-safety': 'no',
          'site-access-safety-concerns': 'some concerns noted here',
        },
      };
      await siteAccessSafetyController.postSiteAccessSafety(mockRequest, res);

      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.APPELLANT_SUBMISSION.TASK_LIST}`);

      const { empty: appeal } = APPEAL_DOCUMENT;
      appeal[sectionName][taskName].hasIssues = false;
      appeal[sectionName][taskName].healthAndSafetyIssues = '';
      appeal.sectionStates[sectionName][taskName] = 'TODO';

      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
    });
  });
});
