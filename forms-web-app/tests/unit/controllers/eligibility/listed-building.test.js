const listedBuildingController = require('../../../../src/controllers/eligibility/listed-building');
const { mockReq, mockRes } = require('../../mocks');

const req = mockReq();
const res = mockRes();

describe('controllers/eligibility/listed-building', () => {
  describe('getServiceNotAvailableForListedBuildings', () => {
    it('calls the correct template', () => {
      listedBuildingController.getServiceNotAvailableForListedBuildings(req, res);

      expect(res.render).toHaveBeenCalledWith('eligibility/listed-out');
    });
  });

  describe('getListedBuilding', () => {
    it('calls the correct template', () => {
      listedBuildingController.getListedBuilding(req, res);

      expect(res.render).toHaveBeenCalledWith('eligibility/listed-building', {
        FORM_FIELD: listedBuildingController.FORM_FIELD,
      });
    });
  });

  describe('postListedBuilding', () => {
    it('should redirect on the happy path', () => {
      const mockRequest = {
        body: {},
      };
      const mockResponse = {
        redirect: jest.fn(),
      };

      listedBuildingController.postListedBuilding(mockRequest, mockResponse);

      expect(mockResponse.redirect).toHaveBeenCalledWith('/eligibility/appeal-statement');
    });

    it('should redirect to listed-out if given a listed building', () => {
      const mockRequest = {
        body: {
          'is-your-appeal-about-a-listed-building': 'yes',
        },
      };
      const mockResponse = {
        redirect: jest.fn(),
      };

      listedBuildingController.postListedBuilding(mockRequest, mockResponse);

      expect(mockResponse.redirect).toHaveBeenCalledWith('/eligibility/listed-out');
    });

    it('calls the correct template on error', () => {
      const mockRequest = {
        body: {
          errors: [1, 2, 3],
        },
      };

      listedBuildingController.postListedBuilding(mockRequest, res);

      expect(res.render).toHaveBeenCalledWith('eligibility/listed-building', {
        FORM_FIELD: listedBuildingController.FORM_FIELD,
        errorSummary: {},
        errors: [1, 2, 3],
      });
    });
  });
});
