const appeal = require('@pins/business-rules/test/data/householder-appeal');
const siteAccessController = require('../../../../src/controllers/appellant-submission/site-access');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const { VIEW } = require('../../../../src/lib/views');
const logger = require('../../../../src/lib/logger');
const { getNextTask, getTaskStatus } = require('../../../../src/services/task.service');
const { mockReq, mockRes } = require('../../mocks');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/services/task.service');
jest.mock('../../../../src/lib/logger');

const sectionName = 'appealSiteSection';
const taskName = 'siteAccess';

describe('controllers/appellant-submission/site-access', () => {
  let req;
  let res;

  beforeEach(() => {
    req = mockReq(appeal);
    res = mockRes();

    jest.resetAllMocks();
  });

  describe('getSiteAccess', () => {
    it('should call the correct template', () => {
      siteAccessController.getSiteAccess(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.SITE_ACCESS, {
        appeal: req.session.appeal,
      });
    });
  });

  describe('postSiteAccess', () => {
    it('should re-render the template with errors if there is any validation error', async () => {
      const mockRequest = {
        ...req,
        body: {
          'site-access': 'bad value',
          errors: { a: 'b' },
          errorSummary: [{ text: 'There were errors here', href: '#' }],
        },
      };
      await siteAccessController.postSiteAccess(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.SITE_ACCESS, {
        appeal: {
          ...req.session.appeal,
          appealSiteSection: {
            ...req.session.appeal.appealSiteSection,
            siteAccess: {
              canInspectorSeeWholeSiteFromPublicRoad: null,
              howIsSiteAccessRestricted: null,
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

      await siteAccessController.postSiteAccess(mockRequest, res);

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);

      expect(res.redirect).not.toHaveBeenCalled();

      expect(logger.error).toHaveBeenCalledWith(error);

      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.SITE_ACCESS, {
        appeal: req.session.appeal,
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it('should redirect to `/appellant-submission/site-access-safety` if `site-access` is `yes`', async () => {
      createOrUpdateAppeal.mockImplementation(() => JSON.stringify({ good: 'data' }));
      getNextTask.mockReturnValue({
        href: `/${VIEW.APPELLANT_SUBMISSION.SITE_ACCESS_SAFETY}`,
      });
      const mockRequest = {
        ...req,
        body: {
          'site-access': 'yes',
        },
      };
      await siteAccessController.postSiteAccess(mockRequest, res);

      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.APPELLANT_SUBMISSION.SITE_ACCESS_SAFETY}`);

      const goodAppeal = appeal;
      goodAppeal[sectionName][taskName].canInspectorSeeWholeSiteFromPublicRoad = true;
      goodAppeal[sectionName][taskName].howIsSiteAccessRestricted = undefined;
      goodAppeal.sectionStates[sectionName][taskName] = 'COMPLETED';

      expect(createOrUpdateAppeal).toHaveBeenCalledWith(goodAppeal);
    });

    it('should redirect to `/appellant-submission/site-access-safety` if `site-access` is `no`', async () => {
      const fakeCanInspectorSeeWholeSiteFromPublicRoad = false;
      const fakeHowIsSiteAccessRestricted = 'more detail';
      const fakeTaskStatus = 'FAKE_STATUS';

      getTaskStatus.mockImplementation(() => fakeTaskStatus);

      getNextTask.mockReturnValue({
        href: `/${VIEW.APPELLANT_SUBMISSION.SITE_ACCESS_SAFETY}`,
      });
      const mockRequest = {
        ...req,
        body: {
          'site-access': 'no',
          'site-access-more-detail': fakeHowIsSiteAccessRestricted,
        },
      };
      await siteAccessController.postSiteAccess(mockRequest, res);

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...appeal,
        [sectionName]: {
          ...appeal[sectionName],
          [taskName]: {
            canInspectorSeeWholeSiteFromPublicRoad: fakeCanInspectorSeeWholeSiteFromPublicRoad,
            howIsSiteAccessRestricted: fakeHowIsSiteAccessRestricted,
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

      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.APPELLANT_SUBMISSION.SITE_ACCESS_SAFETY}`);
    });
  });
});
