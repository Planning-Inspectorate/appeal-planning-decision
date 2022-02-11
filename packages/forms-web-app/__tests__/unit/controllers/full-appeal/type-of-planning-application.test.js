const appeal = require('@pins/business-rules/test/data/full-appeal');
const v8 = require('v8');
const typeOfPlanningApplicationController = require('../../../../src/controllers/full-appeal/type-of-planning-application');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const logger = require('../../../../src/lib/logger');
const { VIEW } = require('../../../../src/lib/views');
const { mockReq, mockRes } = require('../../mocks');
const mapPlanningApplication = require('../../../../src/lib/full-appeal/map-planning-application');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/lib/logger');

describe('controllers/full-appeal/type-of-planning-application', () => {
  let req;
  let res;

  beforeEach(() => {
    req = v8.deserialize(v8.serialize(mockReq(appeal)));
    res = mockRes();

    jest.resetAllMocks();
  });

  describe('Type of Planning Application Controller Tests', () => {
    it('should call the correct template on getTypeOfPlanningApplication', async () => {
      await typeOfPlanningApplicationController.getTypeOfPlanningApplication(req, res);

      expect(res.render).toBeCalledWith(VIEW.FULL_APPEAL.TYPE_OF_PLANNING_APPLICATION, {
        typeOfPlanningApplication: 'full-appeal',
        backLink: `${VIEW.FULL_APPEAL.LOCAL_PLANNING_DEPARTMENT}`,
      });
    });

    it('should redirect to the listed building page', async () => {
      const planningApplication = 'householder-planning';
      const mockRequest = {
        ...req,
        body: { 'type-of-planning-application': planningApplication },
      };

      await typeOfPlanningApplicationController.postTypeOfPlanningApplication(mockRequest, res);

      const updatedAppeal = appeal;
      updatedAppeal.appealType = mapPlanningApplication(planningApplication);
      updatedAppeal.typeOfPlanningApplication = planningApplication;

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...updatedAppeal,
      });

      expect(res.redirect).toBeCalledWith(`/before-you-start/listed-building-householder`);
    });

    it('should redirect to the shutter page', async () => {
      const planningApplication = 'something-else';

      const mockRequest = {
        ...req,
        body: { 'type-of-planning-application': planningApplication },
      };

      await typeOfPlanningApplicationController.postTypeOfPlanningApplication(mockRequest, res);

      const updatedAppeal = appeal;
      updatedAppeal.appealType = mapPlanningApplication(planningApplication);
      updatedAppeal.typeOfPlanningApplication = planningApplication;

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...updatedAppeal,
      });

      expect(res.redirect).toBeCalledWith(`/before-you-start/use-a-different-service`); // Future Planning Application Decision Page
    });

    it('should redirect to the shutter page', async () => {
      const planningApplication = 'i-have-not-made-a-planning-application';

      const mockRequest = {
        ...req,
        body: { 'type-of-planning-application': 'i-have-not-made-a-planning-application' },
      };

      await typeOfPlanningApplicationController.postTypeOfPlanningApplication(mockRequest, res);

      const updatedAppeal = appeal;
      updatedAppeal.appealType = mapPlanningApplication(planningApplication);
      updatedAppeal.typeOfPlanningApplication = planningApplication;

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...updatedAppeal,
      });

      expect(res.redirect).toBeCalledWith(`/before-you-start/use-a-different-service`); // Future Planning Application Decision Page
    });

    it('should redirect to the about appeal page', async () => {
      const planningApplication = 'outline-planning';

      const mockRequest = {
        ...req,
        body: { 'type-of-planning-application': planningApplication },
      };

      await typeOfPlanningApplicationController.postTypeOfPlanningApplication(mockRequest, res);

      const updatedAppeal = appeal;
      updatedAppeal.appealType = mapPlanningApplication(planningApplication);
      updatedAppeal.typeOfPlanningApplication = planningApplication;

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...updatedAppeal,
      });

      expect(res.redirect).toBeCalledWith(`/before-you-start/any-of-following`); // Future Planning Application Decision Page
    });

    it('should render errors on the page', async () => {
      const mockRequest = {
        ...req,
        body: {
          errors: {
            'type-of-planning-application': {
              msg: 'Select which type of planning application your appeal is about, or if you have not made a planning application',
            },
          },
        },
      };
      mockRequest.session.appeal.typeOfPlanningApplication = null;

      await typeOfPlanningApplicationController.postTypeOfPlanningApplication(mockRequest, res);

      expect(createOrUpdateAppeal).not.toHaveBeenCalled();

      expect(res.render).toBeCalledWith(VIEW.FULL_APPEAL.TYPE_OF_PLANNING_APPLICATION, {
        typeOfPlanningApplication: null,
        errors: {
          'type-of-planning-application': {
            msg: 'Select which type of planning application your appeal is about, or if you have not made a planning application',
          },
        },
        errorSummary: [],
        backLink: `${VIEW.FULL_APPEAL.LOCAL_PLANNING_DEPARTMENT}`,
      });
    });

    it('should render page with failed appeal update message', async () => {
      const error = new Error('API is down');

      const mockRequest = {
        ...req,
        body: { 'type-of-planning-application': 'outline-planning' },
      };
      mockRequest.session.appeal.typeOfPlanningApplication = null;

      createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

      await typeOfPlanningApplicationController.postTypeOfPlanningApplication(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalledWith(error);

      expect(res.render).toHaveBeenCalledWith(VIEW.FULL_APPEAL.TYPE_OF_PLANNING_APPLICATION, {
        typeOfPlanningApplication: null,
        errors: {},
        errorSummary: [{ text: error.toString(), href: 'pageId' }],
        backLink: `${VIEW.FULL_APPEAL.LOCAL_PLANNING_DEPARTMENT}`,
      });
    });
  });
});
