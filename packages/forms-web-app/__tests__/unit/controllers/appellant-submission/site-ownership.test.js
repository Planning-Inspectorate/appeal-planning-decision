const siteOwnershipController = require('../../../../src/controllers/appellant-submission/site-ownership');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const { VIEW } = require('../../../../src/lib/views');
const logger = require('../../../../src/lib/logger');
const { getNextTask, getTaskStatus } = require('../../../../src/services/task.service');
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
  let appeal;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();

    ({ empty: appeal } = APPEAL_DOCUMENT);

    jest.resetAllMocks();
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
          [sectionName]: {
            ...req.session.appeal.appealSiteSection,
            [taskName]: {
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

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);

      expect(logger.error).toHaveBeenCalledWith(error);

      expect(res.redirect).not.toHaveBeenCalled();

      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.SITE_OWNERSHIP, {
        appeal: req.session.appeal,
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it('should redirect to the next valid url if ownsWholeSite', async () => {
      const fakeTaskStatus = 'FAKE_STATUS';
      const fakeNextUrl = `/next/valid/url`;

      getNextTask.mockReturnValue({
        href: fakeNextUrl,
      });

      const mockRequest = {
        ...req,
        body: {
          'site-ownership': 'yes',
        },
      };

      getTaskStatus.mockReturnValue(fakeTaskStatus);

      await siteOwnershipController.postSiteOwnership(mockRequest, res);

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...appeal,
        [sectionName]: {
          ...appeal.appealSiteSection,
          [taskName]: {
            ...appeal.appealSiteSection.siteOwnership,
            ownsWholeSite: true,
          },
        },
        sectionStates: {
          ...appeal.sectionStates,
          [sectionName]: {
            ...appeal.sectionStates.appealSiteSection,
            [taskName]: fakeTaskStatus,
          },
        },
      });

      expect(logger.error).not.toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith(fakeNextUrl);
    });

    it(`should redirect to /${VIEW.APPELLANT_SUBMISSION.SITE_OWNERSHIP_CERTB} if does not ownsWholeSite`, async () => {
      const fakeTaskStatus = 'FAKE_STATUS';

      const mockRequest = {
        ...req,
        body: {
          'site-ownership': 'no',
        },
      };

      getTaskStatus.mockReturnValue(fakeTaskStatus);

      await siteOwnershipController.postSiteOwnership(mockRequest, res);

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...appeal,
        [sectionName]: {
          ...appeal.appealSiteSection,
          [taskName]: {
            ...appeal.appealSiteSection.siteOwnership,
          },
        },
        sectionStates: {
          ...appeal.sectionStates,
          [sectionName]: {
            ...appeal.sectionStates.appealSiteSection,
            [taskName]: fakeTaskStatus,
          },
        },
      });

      expect(logger.error).not.toHaveBeenCalled();
      expect(getNextTask).not.toHaveBeenCalledWith();

      expect(res.redirect).toHaveBeenCalledWith(
        `/${VIEW.APPELLANT_SUBMISSION.SITE_OWNERSHIP_CERTB}`
      );
    });
  });

  [true, false, null].forEach((haveOtherOwnersBeenTold) => {
    it('should null the contents of haveOtherOwnersBeenTold if site-ownership is set to yes', async () => {
      const fakeTaskStatus = 'FAKE_STATUS';

      getNextTask.mockReturnValue({ href: '/some/path' });
      getTaskStatus.mockReturnValue(fakeTaskStatus);

      const mockRequest = {
        ...req,
        body: {
          'site-ownership': 'yes',
        },
      };

      mockRequest.session.appeal.appealSiteSection.siteOwnership.haveOtherOwnersBeenTold =
        haveOtherOwnersBeenTold;

      await siteOwnershipController.postSiteOwnership(mockRequest, res);

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...appeal,
        appealSiteSection: {
          ...appeal.appealSiteSection,
          [taskName]: {
            ownsWholeSite: true,
            haveOtherOwnersBeenTold: null,
          },
        },
        sectionStates: {
          ...appeal.sectionStates,
          [sectionName]: {
            ...appeal.sectionStates.appealSiteSection,
            [taskName]: fakeTaskStatus,
          },
        },
      });
    });
  });

  [true, false, null].forEach((haveOtherOwnersBeenTold) => {
    it('should retain the contents of haveOtherOwnersBeenTold if site-ownership is set to no', async () => {
      const fakeTaskStatus = 'FAKE_STATUS';

      getNextTask.mockReturnValue({ href: '/some/path' });
      getTaskStatus.mockReturnValue(fakeTaskStatus);

      const mockRequest = {
        ...req,
        body: {
          'site-ownership': 'no',
        },
      };

      mockRequest.session.appeal.appealSiteSection.siteOwnership.haveOtherOwnersBeenTold =
        haveOtherOwnersBeenTold;

      await siteOwnershipController.postSiteOwnership(mockRequest, res);

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...appeal,
        appealSiteSection: {
          ...appeal.appealSiteSection,
          [taskName]: {
            ownsWholeSite: false,
            haveOtherOwnersBeenTold,
          },
        },
        sectionStates: {
          ...appeal.sectionStates,
          [sectionName]: {
            ...appeal.sectionStates.appealSiteSection,
            [taskName]: fakeTaskStatus,
          },
        },
      });
    });
  });
});
