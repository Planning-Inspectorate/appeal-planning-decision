const listedBuildingController = require('../../../../src/controllers/eligibility/listed-building');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const { VIEW } = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');
const { APPEAL_DOCUMENT } = require('../../../../src/lib/empty-appeal');

jest.mock('../../../../src/lib/appeals-api-wrapper');

describe('controllers/eligibility/listed-building', () => {
  let req;
  let res;
  let appeal;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();

    ({ empty: appeal } = APPEAL_DOCUMENT);

    jest.resetAllMocks();
  });

  describe('getServiceNotAvailableForListedBuildings', () => {
    it('calls the correct template', () => {
      listedBuildingController.getServiceNotAvailableForListedBuildings(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.ELIGIBILITY.LISTED_OUT);
    });
  });

  describe('getListedBuilding', () => {
    it('calls the correct template', () => {
      listedBuildingController.getListedBuilding(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.ELIGIBILITY.LISTED_BUILDING, {
        appeal: req.session.appeal,
        FORM_FIELD: listedBuildingController.FORM_FIELD,
      });
    });
  });

  describe('postListedBuilding', () => {
    it('should re-render the template with errors if there is any validation error', async () => {
      const mockRequest = {
        ...req,
        body: {
          'is-your-appeal-about-a-listed-building': 'bad value',
          errors: { a: 'b' },
          errorSummary: [{ text: 'There were errors here', href: '#' }],
        },
      };
      await listedBuildingController.postListedBuilding(mockRequest, res);

      expect(createOrUpdateAppeal).not.toHaveBeenCalled();

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(VIEW.ELIGIBILITY.LISTED_BUILDING, {
        appeal: {
          ...req.session.appeal,
          eligibility: {
            ...req.session.appeal.eligibility,
            isListedBuilding: null,
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

      await listedBuildingController.postListedBuilding(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();

      expect(req.log.error).toHaveBeenCalledWith(error);

      expect(res.render).toHaveBeenCalledWith(VIEW.ELIGIBILITY.LISTED_BUILDING, {
        appeal: req.session.appeal,
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it('should redirect to `/eligibility/listed-out` if `is-your-appeal-about-a-listed-building` is `yes`', async () => {
      const mockRequest = {
        ...req,
        body: {
          'is-your-appeal-about-a-listed-building': 'yes',
        },
      };
      await listedBuildingController.postListedBuilding(mockRequest, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...appeal,
        eligibility: {
          ...appeal.eligibility,
          isListedBuilding: true,
        },
      });

      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.ELIGIBILITY.LISTED_OUT}`);
    });

    it('should redirect to `/eligibility/costs` if `is-your-appeal-about-a-listed-building` is `no`', async () => {
      const mockRequest = {
        ...req,
        body: {
          'is-your-appeal-about-a-listed-building': 'no',
        },
      };
      await listedBuildingController.postListedBuilding(mockRequest, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...appeal,
        eligibility: {
          ...appeal.eligibility,
          isListedBuilding: false,
        },
      });

      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.ELIGIBILITY.COSTS}`);
    });
  });
});
