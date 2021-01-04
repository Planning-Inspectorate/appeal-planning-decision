const siteLocationController = require('../../../../src/controllers/appellant-submission/site-location');
const { mockReq, mockRes } = require('../../mocks');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const logger = require('../../../../src/lib/logger');
const { getNextUncompletedTask } = require('../../../../src/services/task.service');
const { APPEAL_DOCUMENT } = require('../../../../src/lib/empty-appeal');
const { VIEW } = require('../../../../src/lib/views');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/services/task.service');
jest.mock('../../../../src/lib/logger');

const req = mockReq();
const res = mockRes();

const sectionName = 'appealSiteSection';
const taskName = 'siteAddress';

describe('controllers/appellant-submission/site-location', () => {
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
        appeal: req.session.appeal,
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

      expect(res.redirect).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalledWith(error);
      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.SITE_LOCATION, {
        appeal: req.session.appeal,
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it('should redirect to `/appellant-submission/site-ownership` if valid', async () => {
      createOrUpdateAppeal.mockImplementation(() => JSON.stringify({ good: 'data' }));
      getNextUncompletedTask.mockReturnValue({
        href: `/${VIEW.APPELLANT_SUBMISSION.SITE_OWNERSHIP}`,
      });
      const mockRequest = {
        ...req,
        body: {
          'site-address-line-one': '1 Taylor Road',
          'site-address-line-two': 'Clifton',
          'site-town-city': 'Bristol',
          'site-county': 'South Glos',
          'site-postcode': 'BS8 1TG',
        },
      };
      await siteLocationController.postSiteLocation(mockRequest, res);

      const { empty: goodAppeal } = APPEAL_DOCUMENT;
      goodAppeal[sectionName][taskName].addressLine1 = '1 Taylor Road';
      goodAppeal[sectionName][taskName].addressLine2 = 'Clifton';
      goodAppeal[sectionName][taskName].town = 'Bristol';
      goodAppeal[sectionName][taskName].county = 'South Glos';
      goodAppeal[sectionName][taskName].postcode = 'BS8 1TG';
      goodAppeal.sectionStates[sectionName][taskName] = 'COMPLETED';

      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.APPELLANT_SUBMISSION.SITE_OWNERSHIP}`);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith(goodAppeal);
    });
  });
});
