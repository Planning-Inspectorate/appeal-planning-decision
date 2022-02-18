const appeal = require('@pins/business-rules/test/data/householder-appeal');
const siteLocationController = require('../../../../src/controllers/appellant-submission/site-location');
const { mockReq, mockRes } = require('../../mocks');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const logger = require('../../../../src/lib/logger');
const { getNextTask, getTaskStatus } = require('../../../../src/services/task.service');
const { VIEW } = require('../../../../src/lib/views');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/services/task.service');
jest.mock('../../../../src/lib/logger');

const sectionName = 'appealSiteSection';
const taskName = 'siteAddress';

describe('controllers/appellant-submission/site-location', () => {
  let req;
  let res;

  beforeEach(() => {
    req = mockReq(appeal);
    res = mockRes();

    jest.resetAllMocks();
  });

  describe('getSiteLocation', () => {
    it('should call the correct template', () => {
      siteLocationController.getSiteLocation(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.SITE_LOCATION, {
        appeal: req.session.appeal,
      });
    });
  });

  describe('postSiteLocation', () => {
    it('should re-render the template with errors if submission validation fails', async () => {
      const mockRequest = {
        ...req,
        body: {
          errors: { a: 'b' },
          errorSummary: [{ text: 'There were errors here', href: '#' }],
        },
      };
      await siteLocationController.postSiteLocation(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.SITE_LOCATION, {
        appeal: {
          ...req.session.appeal,
          [sectionName]: {
            ...req.session.appeal[sectionName],
            [taskName]: {
              addressLine1: undefined,
              addressLine2: undefined,
              county: undefined,
              postcode: undefined,
              town: undefined,
            },
          },
        },
        errorSummary: [{ text: 'There were errors here', href: '#' }],
        errors: { a: 'b' },
      });
    });

    it('should log an error if the api call fails, and remain on the same page', async () => {
      const error = new Error('API is down');
      createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));
      const mockRequest = {
        ...req,
        body: {},
      };
      await siteLocationController.postSiteLocation(mockRequest, res);

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);

      expect(logger.error).toHaveBeenCalledWith(error);

      expect(res.redirect).not.toHaveBeenCalled();

      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.SITE_LOCATION, {
        appeal: req.session.appeal,
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it('should redirect to `/appellant-submission/site-ownership` if valid', async () => {
      const fakeLine1 = '1 Taylor Road';
      const fakeLine2 = 'Clifton';
      const fakeTownCity = 'Bristol';
      const fakeCounty = 'South Glos';
      const fakePostcode = 'BS8 1TG';
      const fakeTaskStatus = 'FAKE_STATUS';

      getTaskStatus.mockImplementation(() => fakeTaskStatus);

      getNextTask.mockReturnValue({
        href: `/${VIEW.APPELLANT_SUBMISSION.SITE_OWNERSHIP}`,
      });
      const mockRequest = {
        ...req,
        body: {
          'site-address-line-one': fakeLine1,
          'site-address-line-two': fakeLine2,
          'site-town-city': fakeTownCity,
          'site-county': fakeCounty,
          'site-postcode': fakePostcode,
        },
      };
      await siteLocationController.postSiteLocation(mockRequest, res);

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...appeal,
        [sectionName]: {
          ...appeal[sectionName],
          [taskName]: {
            addressLine1: fakeLine1,
            addressLine2: fakeLine2,
            county: fakeCounty,
            postcode: fakePostcode,
            town: fakeTownCity,
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

      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.APPELLANT_SUBMISSION.SITE_OWNERSHIP}`);
    });
  });
});
