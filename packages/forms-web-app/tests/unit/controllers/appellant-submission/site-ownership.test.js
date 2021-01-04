const siteOwnershipController = require('../../../../src/controllers/appellant-submission/site-ownership');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const { VIEW } = require('../../../../src/lib/views');
const logger = require('../../../../src/lib/logger');
const { getNextUncompletedTask, getTaskStatus } = require('../../../../src/services/task.service');
const { APPEAL_DOCUMENT } = require('../../../../src/lib/empty-appeal');
const { mockReq, mockRes } = require('../../mocks');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/services/task.service');
jest.mock('../../../../src/lib/logger');

const sectionName = 'appealSiteSection';
const taskName = 'siteOwnership';

describe('controllers/appellant-submission/site-ownership', () => {
  let req;
  let res;

  beforeEach(() => {
    jest.resetAllMocks();

    req = mockReq();
    res = mockRes();
  });

  describe('getSiteOwnership', () => {
    it('should call the correct template', () => {
      siteOwnershipController.getSiteOwnership(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.SITE_OWNERSHIP, {
        appeal: req.session.appeal,
      });
    });
  });

  describe('postSiteOwnership', () => {
    it('should re-render the template with errors if there is any validation error', async () => {
      const mockRequest = {
        ...req,
        body: {
          'site-ownership': 'bad value',
          errors: { a: 'b' },
          errorSummary: [{ text: 'There were errors here', href: '#' }],
        },
      };
      await siteOwnershipController.postSiteOwnership(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.SITE_OWNERSHIP, {
        appeal: {
          ...req.session.appeal,
          appealSiteSection: {
            ...req.session.appeal.appealSiteSection,
            siteOwnership: {
              ownsWholeSite: null,
              haveOtherOwnersBeenTold: null,
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

      await siteOwnershipController.postSiteOwnership(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalledWith(error);
      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.SITE_OWNERSHIP, {
        appeal: req.session.appeal,
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it('should redirect to the next valid url if ownsWholeSite', async () => {
      createOrUpdateAppeal.mockImplementation(() => JSON.stringify({ good: 'data' }));
      getNextUncompletedTask.mockReturnValue({
        href: `/next/valid/url`,
      });
      const mockRequest = {
        ...req,
        body: {
          'site-ownership': 'yes',
        },
      };

      getTaskStatus.mockReturnValue('TEST_STATUS');

      await siteOwnershipController.postSiteOwnership(mockRequest, res);

      const { empty: goodAppeal } = APPEAL_DOCUMENT;

      expect(getTaskStatus).toHaveBeenCalledWith(goodAppeal, sectionName, taskName);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...goodAppeal,
        appealSiteSection: {
          ...goodAppeal.appealSiteSection,
          siteOwnership: {
            ...goodAppeal.appealSiteSection.siteOwnership,
            ownsWholeSite: true,
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

    it(`should redirect to /${VIEW.APPELLANT_SUBMISSION.SITE_OWNERSHIP_CERTB} if does not ownsWholeSite`, async () => {
      createOrUpdateAppeal.mockImplementation(() => JSON.stringify({ good: 'data' }));

      const mockRequest = {
        ...req,
        body: {
          'site-ownership': 'no',
        },
      };

      getTaskStatus.mockReturnValue('TEST_STATUS');

      await siteOwnershipController.postSiteOwnership(mockRequest, res);

      const { empty: goodAppeal } = APPEAL_DOCUMENT;

      expect(getTaskStatus).toHaveBeenCalledWith(goodAppeal, sectionName, taskName);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...goodAppeal,
        appealSiteSection: {
          ...goodAppeal.appealSiteSection,
          siteOwnership: {
            ...goodAppeal.appealSiteSection.siteOwnership,
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
      expect(getNextUncompletedTask).not.toHaveBeenCalledWith();

      expect(res.redirect).toHaveBeenCalledWith(
        `/${VIEW.APPELLANT_SUBMISSION.SITE_OWNERSHIP_CERTB}`
      );
    });
  });

  [true, false, null].forEach((haveOtherOwnersBeenTold) => {
    it('should null the contents of haveOtherOwnersBeenTold if site-ownership is set to yes', async () => {
      getNextUncompletedTask.mockReturnValue({ href: '/some/path' });
      getTaskStatus.mockReturnValue('TEST_STATUS');

      const mockRequest = {
        ...req,
        body: {
          'site-ownership': 'yes',
        },
      };

      mockRequest.session.appeal.appealSiteSection.siteOwnership.haveOtherOwnersBeenTold = haveOtherOwnersBeenTold;

      await siteOwnershipController.postSiteOwnership(mockRequest, res);

      const { empty: goodAppeal } = APPEAL_DOCUMENT;

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...goodAppeal,
        appealSiteSection: {
          ...goodAppeal.appealSiteSection,
          siteOwnership: {
            ownsWholeSite: true,
            haveOtherOwnersBeenTold: null,
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
    });
  });

  [true, false, null].forEach((haveOtherOwnersBeenTold) => {
    it('should retain the contents of haveOtherOwnersBeenTold if site-ownership is set to no', async () => {
      getNextUncompletedTask.mockReturnValue({ href: '/some/path' });
      getTaskStatus.mockReturnValue('TEST_STATUS');

      const mockRequest = {
        ...req,
        body: {
          'site-ownership': 'no',
        },
      };

      mockRequest.session.appeal.appealSiteSection.siteOwnership.haveOtherOwnersBeenTold = haveOtherOwnersBeenTold;

      await siteOwnershipController.postSiteOwnership(mockRequest, res);

      const { empty: goodAppeal } = APPEAL_DOCUMENT;

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...goodAppeal,
        appealSiteSection: {
          ...goodAppeal.appealSiteSection,
          siteOwnership: {
            ownsWholeSite: false,
            haveOtherOwnersBeenTold,
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
    });
  });
});
