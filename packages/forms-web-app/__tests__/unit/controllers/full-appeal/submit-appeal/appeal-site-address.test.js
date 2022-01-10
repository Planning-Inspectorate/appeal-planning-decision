const appealSiteAddressController = require('../../../../../src/controllers/full-appeal/submit-appeal/appeal-site-address');
const { mockReq, mockRes } = require('../../../mocks');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const logger = require('../../../../../src/lib/logger');
const {
  getNextTask,
  getTaskStatus,
  FULL_APPEAL_SECTIONS,
} = require('../../../../../src/services/task.service');
const { APPEAL_DOCUMENT } = require('../../../../../src/lib/empty-appeal');
const {
  VIEW: {
    FULL_APPEAL: { APPEAL_SITE_ADDRESS: currentPage, OWN_ALL_THE_LAND },
  },
} = require('../../../../../src/lib/full-appeal/views');

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/services/task.service');
jest.mock('../../../../../src/lib/logger');

const sectionName = 'appealSiteSection';
const taskName = 'siteAddress';

describe('controllers/full-appeal/submit-appeal/appeal-site-address', () => {
  let req;
  let res;
  let appeal;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();

    ({ empty: appeal } = APPEAL_DOCUMENT);

    jest.resetAllMocks();
  });

  describe('getAppealSiteAddress', () => {
    it('should call the correct template', () => {
      appealSiteAddressController.getAppealSiteAddress(req, res);

      expect(res.render).toHaveBeenCalledWith(currentPage, {
        appeal: req.session.appeal,
      });
    });
  });

  describe('postAppealSiteAddress', () => {
    it('should re-render the template with errors if submission validation fails', async () => {
      const mockRequest = {
        ...req,
        body: {
          errors: { a: 'b' },
          errorSummary: [{ text: 'There were errors here', href: '#' }],
        },
      };
      await appealSiteAddressController.postAppealSiteAddress(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(currentPage, {
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
      await appealSiteAddressController.postAppealSiteAddress(mockRequest, res);

      expect(getTaskStatus).toHaveBeenCalledWith(
        appeal,
        sectionName,
        taskName,
        FULL_APPEAL_SECTIONS
      );

      expect(logger.error).toHaveBeenCalledWith(error);

      expect(res.redirect).not.toHaveBeenCalled();

      expect(res.render).toHaveBeenCalledWith(currentPage, {
        appeal: req.session.appeal,
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it('should redirect to `/full-appeal/submit-appeal/own-all-the-land` if valid', async () => {
      const fakeLine1 = '1 Taylor Road';
      const fakeLine2 = 'Clifton';
      const fakeTownCity = 'Bristol';
      const fakeCounty = 'South Glos';
      const fakePostcode = 'BS8 1TG';
      const fakeTaskStatus = 'FAKE_STATUS';

      getTaskStatus.mockImplementation(() => fakeTaskStatus);

      getNextTask.mockReturnValue({
        href: `/${OWN_ALL_THE_LAND}`,
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
      await appealSiteAddressController.postAppealSiteAddress(mockRequest, res);

      expect(getTaskStatus).toHaveBeenCalledWith(
        appeal,
        sectionName,
        taskName,
        FULL_APPEAL_SECTIONS
      );

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

      expect(res.redirect).toHaveBeenCalledWith(`/${OWN_ALL_THE_LAND}`);
    });
  });
});
