const {
  getVisibleFromRoad,
  postVisibleFromRoad,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/visible-from-road');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const { getTaskStatus } = require('../../../../../src/services/task.service');
const { APPEAL_DOCUMENT } = require('../../../../../src/lib/empty-appeal');
const { mockReq, mockRes } = require('../../../mocks');
const {
  VIEW: {
    FULL_APPEAL: { HEALTH_SAFETY_ISSUES, VISIBLE_FROM_ROAD },
  },
} = require('../../../../../src/lib/full-appeal/views');

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/services/task.service');

describe('controllers/full-appeal/submit-appeal/visible-from-road', () => {
  let req;
  let res;
  let appeal;

  const sectionName = 'appealSiteSection';
  const taskName = 'isVisibleFromRoad';
  const appealId = 'da368e66-de7b-44c4-a403-36e5bf5b000b';
  const errors = { 'visible-from-road': 'Select an option' };
  const errorSummary = [{ text: 'There was an error', href: '#' }];

  beforeEach(() => {
    appeal = {
      ...APPEAL_DOCUMENT.empty,
      id: appealId,
      appealSiteSection: {
        isVisibleFromRoad: true,
        visibleFromRoadDetails: null,
      },
    };
    req = {
      ...mockReq(),
      body: {},
      session: {
        appeal,
      },
    };
    res = mockRes();

    jest.resetAllMocks();
  });

  describe('getVisibleFromRoad', () => {
    it('should call the correct template', () => {
      getVisibleFromRoad(req, res);

      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(VISIBLE_FROM_ROAD, {
        isVisibleFromRoad: true,
        visibleFromRoadDetails: null,
      });
    });

    it('should call the correct template when appeal.appealSiteSection is not defined', () => {
      delete appeal.appealSiteSection;

      getVisibleFromRoad(req, res);

      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(VISIBLE_FROM_ROAD, {
        isVisibleFromRoad: undefined,
        visibleFromRoadDetails: undefined,
      });
    });
  });

  describe('postVisibleFromRoad', () => {
    it('should re-render the template with errors if submission validation fails', async () => {
      req = {
        ...req,
        body: {
          'visible-from-road': false,
          'visible-from-road-details': null,
          errors,
          errorSummary,
        },
      };

      await postVisibleFromRoad(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(VISIBLE_FROM_ROAD, {
        isVisibleFromRoad: false,
        visibleFromRoadDetails: null,
        errors,
        errorSummary,
      });
    });

    it('should re-render the template with errors if an error is thrown', async () => {
      const error = new Error('Internal Server Error');

      req = {
        ...req,
        body: {
          'visible-from-road': 'yes',
          'visible-from-road-details': null,
        },
      };

      createOrUpdateAppeal.mockImplementation(() => {
        throw error;
      });

      await postVisibleFromRoad(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(VISIBLE_FROM_ROAD, {
        isVisibleFromRoad: true,
        visibleFromRoadDetails: null,
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it('should redirect to the correct page if `yes` has been selected', async () => {
      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };

      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      req = {
        ...req,
        body: {
          'visible-from-road': 'yes',
          'visible-from-road-details': null,
        },
      };

      await postVisibleFromRoad(req, res);

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${HEALTH_SAFETY_ISSUES}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it('should redirect to the correct page if `no` has been selected', async () => {
      appeal.appealSiteSection = {
        isVisibleFromRoad: true,
        visibleFromRoadDetails: null,
      };

      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };

      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      req = {
        ...req,
        body: {
          'visible-from-road': 'no',
          'visible-from-road-details': 'Access via the road at the side of the property',
        },
      };

      await postVisibleFromRoad(req, res);

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${HEALTH_SAFETY_ISSUES}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it('should redirect to the correct page if `yes` has been selected and appeal.appealSiteSection is not defined', async () => {
      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };

      delete appeal.appealSiteSection;

      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      req = {
        ...req,
        body: {
          'visible-from-road': 'yes',
          'visible-from-road-details': null,
        },
      };

      await postVisibleFromRoad(req, res);

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${HEALTH_SAFETY_ISSUES}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it('should redirect to the correct page if `no` has been selected and appeal.appealSiteSection is not defined', async () => {
      appeal.appealSiteSection = {
        isVisibleFromRoad: true,
        visibleFromRoadDetails: null,
      };

      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };

      delete appeal.appealSiteSection;

      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      req = {
        ...req,
        body: {
          'visible-from-road': 'no',
          'visible-from-road-details': 'Access via the road at the side of the property',
        },
      };

      await postVisibleFromRoad(req, res);

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${HEALTH_SAFETY_ISSUES}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it('should redirect to the correct page if `yes` has been selected and appeal.sectionStates.appealSiteSection is not defined', async () => {
      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };

      delete appeal.sectionStates.appealSiteSection;

      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      req = {
        ...req,
        body: {
          'visible-from-road': 'yes',
          'visible-from-road-details': null,
        },
      };

      await postVisibleFromRoad(req, res);

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${HEALTH_SAFETY_ISSUES}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it('should redirect to the correct page if `no` has been selected and appeal.sectionStates.appealSiteSection is not defined', async () => {
      appeal.appealSiteSection = {
        isVisibleFromRoad: true,
        visibleFromRoadDetails: null,
      };

      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };

      delete appeal.sectionStates.appealSiteSection;

      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      req = {
        ...req,
        body: {
          'visible-from-road': 'no',
          'visible-from-road-details': 'Access via the road at the side of the property',
        },
      };

      await postVisibleFromRoad(req, res);

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${HEALTH_SAFETY_ISSUES}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });
  });
});
