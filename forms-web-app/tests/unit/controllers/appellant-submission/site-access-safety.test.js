const siteAccessSafetyController = require('../../../../src/controllers/appellant-submission/site-access-safety');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const { VIEW } = require('../../../../src/lib/views');
const logger = require('../../../../src/lib/logger');
const { mockReq, mockRes } = require('../../mocks');
const { EMPTY_APPEAL } = require('../../../../src/lib/appeals-api-wrapper');

jest.mock('../../../../src/lib/appeals-api-wrapper');
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

    it('should redirect to the task list', async () => {
      createOrUpdateAppeal.mockImplementation(() => JSON.stringify({ good: 'data' }));
      const mockRequest = {
        ...req,
        body: {
          'site-access-safety': 'yes',
          'site-access-safety-concerns': 'some concerns noted here',
        },
      };
      await siteAccessSafetyController.postSiteAccessSafety(mockRequest, res);

      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.APPELLANT_SUBMISSION.TASK_LIST}`);

      const appeal = JSON.parse(JSON.stringify(EMPTY_APPEAL));
      appeal[sectionName][taskName].hasIssues = 'yes';
      appeal[sectionName][taskName].healthAndSafetyIssues = 'some concerns noted here';
      appeal.sectionStates[sectionName][taskName] = 'TODO';

      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
    });
  });
});
