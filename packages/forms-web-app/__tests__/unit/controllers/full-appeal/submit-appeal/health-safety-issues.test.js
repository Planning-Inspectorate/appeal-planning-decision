const {
  getHealthSafetyIssues,
  postHealthSafetyIssues,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/health-safety-issues');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const { getTaskStatus } = require('../../../../../src/services/task.service');
const { APPEAL_DOCUMENT } = require('../../../../../src/lib/empty-appeal');
const { mockReq, mockRes } = require('../../../mocks');
const {
  VIEW: {
    FULL_APPEAL: { HEALTH_SAFETY_ISSUES, TASK_LIST },
  },
} = require('../../../../../src/lib/full-appeal/views');

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/services/task.service');

describe('controllers/full-appeal/submit-appeal/health-safety-issues', () => {
  let req;
  let res;
  let appeal;

  const sectionName = 'appealSiteSection';
  const hasHealthSafetyIssuesTask = 'hasHealthSafetyIssues';
  const healthSafetyIssuesDetailsTask = 'healthSafetyIssuesDetails';
  const appealId = 'da368e66-de7b-44c4-a403-36e5bf5b000b';
  const errors = { 'health-safety-issues': 'Select an option' };
  const errorSummary = [{ text: 'There was an error', href: '#' }];

  beforeEach(() => {
    appeal = {
      ...APPEAL_DOCUMENT.empty,
      id: appealId,
      appealSiteSection: {
        hasHealthSafetyIssues: true,
        healthSafetyIssuesDetails: null,
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

  describe('getHealthSafetyIssues', () => {
    it('should call the correct template', () => {
      getHealthSafetyIssues(req, res);

      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(HEALTH_SAFETY_ISSUES, {
        hasHealthSafetyIssues: true,
        healthSafetyIssuesDetails: null,
      });
    });

    it('should call the correct template when appeal.appealSiteSection is not defined', () => {
      delete appeal.appealSiteSection;

      getHealthSafetyIssues(req, res);

      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(HEALTH_SAFETY_ISSUES, {
        hasHealthSafetyIssues: undefined,
        healthSafetyIssuesDetails: undefined,
      });
    });
  });

  describe('postHealthSafetyIssues', () => {
    it('should re-render the template with errors if submission validation fails', async () => {
      req = {
        ...req,
        body: {
          'health-safety-issues': false,
          'health-safety-issues-details': null,
          errors,
          errorSummary,
        },
      };

      await postHealthSafetyIssues(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(HEALTH_SAFETY_ISSUES, {
        hasHealthSafetyIssues: false,
        healthSafetyIssuesDetails: null,
        errors,
        errorSummary,
      });
    });

    it('should re-render the template with errors if an error is thrown', async () => {
      const error = new Error('Internal Server Error');

      req = {
        ...req,
        body: {
          'health-safety-issues': 'yes',
          'health-safety-issues-details': null,
        },
      };

      createOrUpdateAppeal.mockImplementation(() => {
        throw error;
      });

      await postHealthSafetyIssues(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(HEALTH_SAFETY_ISSUES, {
        hasHealthSafetyIssues: true,
        healthSafetyIssuesDetails: null,
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
          'health-safety-issues': 'yes',
          'health-safety-issues-details': 'The site has poor mobile reception',
        },
      };

      await postHealthSafetyIssues(req, res);

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, hasHealthSafetyIssuesTask);
      expect(getTaskStatus).toHaveBeenCalledWith(
        appeal,
        sectionName,
        healthSafetyIssuesDetailsTask
      );
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${TASK_LIST}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it('should redirect to the correct page if `no` has been selected', async () => {
      appeal.appealSiteSection = {
        hasHealthSafetyIssues: true,
        healthSafetyIssuesDetails: null,
      };

      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };

      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      req = {
        ...req,
        body: {
          'health-safety-issues': 'no',
          'health-safety-issues-details': null,
        },
      };

      await postHealthSafetyIssues(req, res);

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, hasHealthSafetyIssuesTask);
      expect(getTaskStatus).toHaveBeenCalledWith(
        appeal,
        sectionName,
        healthSafetyIssuesDetailsTask
      );
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${TASK_LIST}`);
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
          'health-safety-issues': 'yes',
          'health-safety-issues-details': 'The site has poor mobile reception',
        },
      };

      await postHealthSafetyIssues(req, res);

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, hasHealthSafetyIssuesTask);
      expect(getTaskStatus).toHaveBeenCalledWith(
        appeal,
        sectionName,
        healthSafetyIssuesDetailsTask
      );
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${TASK_LIST}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it('should redirect to the correct page if `no` has been selected and appeal.appealSiteSection is not defined', async () => {
      appeal.appealSiteSection = {
        hasHealthSafetyIssues: true,
        healthSafetyIssuesDetails: null,
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
          'health-safety-issues': 'no',
          'health-safety-issues-details': null,
        },
      };

      await postHealthSafetyIssues(req, res);

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, hasHealthSafetyIssuesTask);
      expect(getTaskStatus).toHaveBeenCalledWith(
        appeal,
        sectionName,
        healthSafetyIssuesDetailsTask
      );
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${TASK_LIST}`);
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
          'health-safety-issues': 'yes',
          'health-safety-issues-details': 'The site has poor mobile reception',
        },
      };

      await postHealthSafetyIssues(req, res);

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, hasHealthSafetyIssuesTask);
      expect(getTaskStatus).toHaveBeenCalledWith(
        appeal,
        sectionName,
        healthSafetyIssuesDetailsTask
      );
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${TASK_LIST}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it('should redirect to the correct page if `no` has been selected and appeal.sectionStates.appealSiteSection is not defined', async () => {
      appeal.appealSiteSection = {
        hasHealthSafetyIssues: true,
        healthSafetyIssuesDetails: null,
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
          'health-safety-issues': 'no',
          'health-safety-issues-details': null,
        },
      };

      await postHealthSafetyIssues(req, res);

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, hasHealthSafetyIssuesTask);
      expect(getTaskStatus).toHaveBeenCalledWith(
        appeal,
        sectionName,
        healthSafetyIssuesDetailsTask
      );
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${TASK_LIST}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });
  });
});
