const appeal = require('@pins/business-rules/test/data/full-appeal');
const v8 = require('v8');
const {
  getHealthSafetyIssues,
  postHealthSafetyIssues,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/health-safety-issues');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const { getTaskStatus } = require('../../../../../src/services/task.service');
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

  const sectionName = 'appealSiteSection';
  const taskName = 'healthAndSafety';
  const errors = { 'health-safety-issues': 'Select an option' };
  const errorSummary = [{ text: 'There was an error', href: '#' }];

  beforeEach(() => {
    req = v8.deserialize(
      v8.serialize({
        ...mockReq(appeal),
        body: {},
      })
    );
    res = mockRes();

    jest.resetAllMocks();
  });

  describe('getHealthSafetyIssues', () => {
    it('should call the correct template', () => {
      getHealthSafetyIssues(req, res);

      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(HEALTH_SAFETY_ISSUES, {
        healthAndSafety: {
          hasIssues: true,
          details: 'The site has poor mobile reception',
        },
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
        healthAndSafety: {
          hasIssues: false,
          details: null,
        },
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
        healthAndSafety: {
          hasIssues: true,
          details: null,
        },
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
      getTaskStatus.mockReturnValue('NOT STARTED');

      req = {
        ...req,
        body: {
          'health-safety-issues': 'yes',
          'health-safety-issues-details': 'The site has poor mobile reception',
        },
      };

      await postHealthSafetyIssues(req, res);

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${TASK_LIST}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it('should redirect to the correct page if `no` has been selected', async () => {
      appeal.appealSiteSection.healthAndSafety = {
        hasIssues: false,
        details: null,
      };

      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };

      createOrUpdateAppeal.mockReturnValue(submittedAppeal);
      getTaskStatus.mockReturnValue('NOT STARTED');

      req = {
        ...req,
        body: {
          'health-safety-issues': 'no',
          'health-safety-issues-details': null,
        },
      };

      await postHealthSafetyIssues(req, res);

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${TASK_LIST}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });
  });
});
