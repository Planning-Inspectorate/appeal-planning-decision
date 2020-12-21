const siteOwnershipCertBController = require('../../../../src/controllers/appellant-submission/site-ownership-certb');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const { VIEW } = require('../../../../src/lib/views');
const logger = require('../../../../src/lib/logger');
const { getNextUncompletedTask, getTaskStatus } = require('../../../../src/services/task.service');
const { APPEAL_DOCUMENT } = require('../../../../src/lib/empty-appeal');
const { mockReq, mockRes } = require('../../mocks');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/services/task.service');
jest.mock('../../../../src/lib/logger');

const req = mockReq();
const res = mockRes();

const sectionName = 'appealSiteSection';
const taskName = 'siteOwnership';

describe('controller/appellant-submission/site-ownership-certb', () => {
  describe('getSiteOwnershipCertB', () => {
    it('should call the correct template', () => {
      siteOwnershipCertBController.getSiteOwnershipCertB(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.SITE_OWNERSHIP_CERTB, {
        appeal: req.session.appeal,
      });
    });
  });

  describe('postSiteOwnershipCertB', () => {
    it('should re-render the template with errors if there is any validation error', async () => {
      const mockRequest = {
        ...req,
        body: {
          'have-other-owners-been-told': 'bad value',
          errors: { a: 'b' },
          errorSummary: [{ text: 'There were errors here', href: '#' }],
        },
      };
      await siteOwnershipCertBController.postSiteOwnershipCertB(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.SITE_OWNERSHIP_CERTB, {
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

      await siteOwnershipCertBController.postSiteOwnershipCertB(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalledWith(error);
      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.SITE_OWNERSHIP_CERTB, {
        appeal: req.session.appeal,
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it('should redirect to the next valid url if valid', async () => {
      createOrUpdateAppeal.mockImplementation(() => JSON.stringify({ good: 'data' }));
      getNextUncompletedTask.mockReturnValue({
        href: `/next/valid/url`,
      });
      const mockRequest = {
        ...req,
        body: {
          'have-other-owners-been-told': 'no',
        },
      };

      getTaskStatus.mockReturnValue('TEST_STATUS');

      await siteOwnershipCertBController.postSiteOwnershipCertB(mockRequest, res);

      const { empty: goodAppeal } = APPEAL_DOCUMENT;

      expect(getTaskStatus).toHaveBeenCalledWith(goodAppeal, sectionName, taskName);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...goodAppeal,
        appealSiteSection: {
          ...goodAppeal.appealSiteSection,
          siteOwnership: {
            ...goodAppeal.appealSiteSection.siteOwnership,
            haveOtherOwnersBeenTold: false,
          },
        },
        sectionStates: {
          ...goodAppeal.sectionStates,
          appealSiteSection: {
            ...goodAppeal.sectionStates.appealSiteSection,
            siteOwnership: 'TEST_STATUS',
          },
        },
      });

      expect(logger.error).not.toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith(`/next/valid/url`);
    });
  });
});
