const siteLocationController = require('../../../../src/controllers/appellant-submission/site-location');
const { mockReq, mockRes } = require('../../mocks');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const logger = require('../../../../src/lib/logger');
const { EMPTY_APPEAL } = require('../../../../src/lib/appeals-api-wrapper');
const { VIEW } = require('../../../../src/lib/views');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/lib/logger');

const req = mockReq();
const res = mockRes();

const sectionName = 'appealSiteSection';
const taskName = 'siteAddress';

describe('controller/appellant-submission/site-location', () => {
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
          errorSummary: { a: { msg: 'There were errors here' } },
        },
      };
      await siteLocationController.postSiteLocation(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.SITE_LOCATION, {
        appeal: req.session.appeal,
        errorSummary: { a: { msg: 'There were errors here' } },
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
    });

    it('should redirect to `/appellant-submission/site-ownership` if valid', async () => {
      createOrUpdateAppeal.mockImplementation(() => JSON.stringify({ good: 'data' }));

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

      const goodAppeal = JSON.parse(JSON.stringify(EMPTY_APPEAL));
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
