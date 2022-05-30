const appeal = require('@pins/business-rules/test/data/full-appeal');
const v8 = require('v8');
const {
  constants: { PLANNING_OBLIGATION_STATUS_OPTION },
} = require('@pins/business-rules');
const {
  getNewSupportingDocuments,
  postNewSupportingDocuments,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/new-documents');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const { mockReq, mockRes } = require('../../../mocks');
const {
  VIEW: {
    FULL_APPEAL: {
      OTHER_SUPPORTING_DOCUMENTS,
      NEW_DOCUMENTS,
      TASK_LIST,
      PLANNING_OBLIGATION_PLANNED,
      PLANNING_OBLIGATION_DOCUMENTS,
      DRAFT_PLANNING_OBLIGATION,
      PLANNING_OBLIGATION_DEADLINE,
    },
  },
} = require('../../../../../src/lib/full-appeal/views');
const TASK_STATUS = require('../../../../../src/services/task-status/task-statuses');

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/services/task.service');

describe('controllers/full-appeal/submit-appeal/new-documents', () => {
  let req;
  let res;

  const sectionName = 'appealDocumentsSection';
  const taskName = 'supportingDocuments';
  const errors = { 'supporting-documents': 'Select an option' };
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

  describe('getNewSupportingDocuments', () => {
    it('should call the correct template - no planning obligation submitted', () => {
      req.session.appeal.appealDocumentsSection.planningObligations.plansPlanningObligation = false;
      req = {
        ...req,
        headers: {
          referer: `/${PLANNING_OBLIGATION_PLANNED}`,
        },
      };

      getNewSupportingDocuments(req, res);

      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(NEW_DOCUMENTS, {
        hasSupportingDocuments: true,
        backLink: `/${PLANNING_OBLIGATION_PLANNED}`,
      });
    });

    it('should call the correct template - planning obligation submitted', () => {
      req = {
        ...req,
        headers: {
          referer: `/${PLANNING_OBLIGATION_DOCUMENTS}`,
        },
      };
      Object.assign(req.session.appeal.appealDocumentsSection.planningObligations, {
        plansPlanningObligation: true,
        planningObligationStatus: PLANNING_OBLIGATION_STATUS_OPTION.FINALISED,
      });

      getNewSupportingDocuments(req, res);

      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(NEW_DOCUMENTS, {
        hasSupportingDocuments: true,
        backLink: `/${PLANNING_OBLIGATION_DOCUMENTS}`,
      });
    });

    it('should call the correct template - draft planning obligation submitted', () => {
      req = {
        ...req,
        headers: {
          referer: `/${DRAFT_PLANNING_OBLIGATION}`,
        },
      };
      Object.assign(req.session.appeal.appealDocumentsSection.planningObligations, {
        plansPlanningObligation: true,
        planningObligationStatus: PLANNING_OBLIGATION_STATUS_OPTION.DRAFT,
      });

      getNewSupportingDocuments(req, res);

      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(NEW_DOCUMENTS, {
        hasSupportingDocuments: true,
        backLink: `/${DRAFT_PLANNING_OBLIGATION}`,
      });
    });

    it('should call the correct template - not started planning obligation yet', () => {
      req = {
        ...req,
        headers: {
          referer: `/${PLANNING_OBLIGATION_DEADLINE}`,
        },
      };
      Object.assign(req.session.appeal.appealDocumentsSection.planningObligations, {
        plansPlanningObligation: true,
        planningObligationStatus: PLANNING_OBLIGATION_STATUS_OPTION.NOT_STARTED,
      });

      getNewSupportingDocuments(req, res);

      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(NEW_DOCUMENTS, {
        hasSupportingDocuments: true,
        backLink: `/${PLANNING_OBLIGATION_DEADLINE}`,
      });
    });
  });

  describe('postNewSupportingDocuments', () => {
    it('should re-render the template with errors if submission validation fails & no planning obligation submitted', async () => {
      req = {
        ...req,
        body: {
          'supporting-documents': undefined,
          errors,
          errorSummary,
        },
        headers: {
          referer: `/${PLANNING_OBLIGATION_PLANNED}`,
        },
      };
      req.session.appeal.appealDocumentsSection.planningObligations.plansPlanningObligation = false;

      await postNewSupportingDocuments(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(NEW_DOCUMENTS, {
        backLink: `/${PLANNING_OBLIGATION_PLANNED}`,
        errors,
        errorSummary,
      });
    });

    it('should re-render the template with errors if submission validation fails & planning obligation submitted', async () => {
      req = {
        ...req,
        body: {
          'supporting-documents': undefined,
          errors,
          errorSummary,
        },
        headers: {
          referer: `/${PLANNING_OBLIGATION_DOCUMENTS}`,
        },
      };
      Object.assign(req.session.appeal.appealDocumentsSection.planningObligations, {
        plansPlanningObligation: true,
        planningObligationStatus: PLANNING_OBLIGATION_STATUS_OPTION.FINALISED,
      });

      await postNewSupportingDocuments(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(NEW_DOCUMENTS, {
        backLink: `/${PLANNING_OBLIGATION_DOCUMENTS}`,
        errors,
        errorSummary,
      });
    });

    it('should re-render the template with errors if submission validation fails & draft planning obligation submitted', async () => {
      req = {
        ...req,
        body: {
          'supporting-documents': undefined,
          errors,
          errorSummary,
        },
        headers: {
          referer: `/${DRAFT_PLANNING_OBLIGATION}`,
        },
      };
      Object.assign(req.session.appeal.appealDocumentsSection.planningObligations, {
        plansPlanningObligation: true,
        planningObligationStatus: PLANNING_OBLIGATION_STATUS_OPTION.DRAFT,
      });

      await postNewSupportingDocuments(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(NEW_DOCUMENTS, {
        backLink: `/${DRAFT_PLANNING_OBLIGATION}`,
        errors,
        errorSummary,
      });
    });

    it('should re-render the template with errors if submission validation fails & planning obligation not yet started', async () => {
      req = {
        ...req,
        body: {
          'supporting-documents': undefined,
          errors,
          errorSummary,
        },
        headers: {
          referer: `/${PLANNING_OBLIGATION_DEADLINE}`,
        },
      };
      Object.assign(req.session.appeal.appealDocumentsSection.planningObligations, {
        plansPlanningObligation: true,
        planningObligationStatus: PLANNING_OBLIGATION_STATUS_OPTION.NOT_STARTED,
      });

      await postNewSupportingDocuments(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(NEW_DOCUMENTS, {
        backLink: `/${PLANNING_OBLIGATION_DEADLINE}`,
        errors,
        errorSummary,
      });
    });

    it('should re-render the template with errors if an error is thrown and no planning obligation submitted', async () => {
      const error = new Error('Internal Server Error');

      req.session.appeal.appealDocumentsSection.planningObligations.plansPlanningObligation = false;
      req = {
        ...req,
        headers: {
          referer: `/${PLANNING_OBLIGATION_PLANNED}`,
        },
      };

      createOrUpdateAppeal.mockImplementation(() => {
        throw error;
      });

      await postNewSupportingDocuments(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(NEW_DOCUMENTS, {
        hasSupportingDocuments: false,
        backLink: `/${PLANNING_OBLIGATION_PLANNED}`,
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it('should re-render the template with errors if an error is thrown and planning obligation submitted', async () => {
      const error = new Error('Internal Server Error');

      req = {
        ...req,
        headers: {
          referer: `/${PLANNING_OBLIGATION_DOCUMENTS}`,
        },
      };

      Object.assign(req.session.appeal.appealDocumentsSection.planningObligations, {
        plansPlanningObligation: true,
        planningObligationStatus: PLANNING_OBLIGATION_STATUS_OPTION.FINALISED,
      });

      createOrUpdateAppeal.mockImplementation(() => {
        throw error;
      });

      await postNewSupportingDocuments(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(NEW_DOCUMENTS, {
        hasSupportingDocuments: false,
        backLink: `/${PLANNING_OBLIGATION_DOCUMENTS}`,
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it('should re-render the template with errors if an error is thrown and draft planning obligation submitted', async () => {
      const error = new Error('Internal Server Error');

      req = {
        ...req,
        headers: {
          referer: `/${DRAFT_PLANNING_OBLIGATION}`,
        },
      };

      Object.assign(req.session.appeal.appealDocumentsSection.planningObligations, {
        plansPlanningObligation: true,
        planningObligationStatus: PLANNING_OBLIGATION_STATUS_OPTION.DRAFT,
      });

      createOrUpdateAppeal.mockImplementation(() => {
        throw error;
      });

      await postNewSupportingDocuments(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(NEW_DOCUMENTS, {
        hasSupportingDocuments: false,
        backLink: `/${DRAFT_PLANNING_OBLIGATION}`,
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it('should re-render the template with errors if an error is thrown and no planning obligation not yet started', async () => {
      const error = new Error('Internal Server Error');

      req = {
        ...req,
        headers: {
          referer: `/${PLANNING_OBLIGATION_DEADLINE}`,
        },
      };

      Object.assign(req.session.appeal.appealDocumentsSection.planningObligations, {
        plansPlanningObligation: true,
        planningObligationStatus: PLANNING_OBLIGATION_STATUS_OPTION.NOT_STARTED,
      });

      createOrUpdateAppeal.mockImplementation(() => {
        throw error;
      });

      await postNewSupportingDocuments(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(NEW_DOCUMENTS, {
        hasSupportingDocuments: false,
        backLink: `/${PLANNING_OBLIGATION_DEADLINE}`,
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it('should redirect to the correct page if `yes` has been selected', async () => {
      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };
      submittedAppeal.sectionStates.appealDocumentsSection.supportingDocuments =
        TASK_STATUS.COMPLETED;

      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      req = {
        ...req,
        body: {
          'supporting-documents': 'yes',
        },
        headers: {
          referer: '',
        },
      };

      await postNewSupportingDocuments(req, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${OTHER_SUPPORTING_DOCUMENTS}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it('should redirect to the correct page if `no` has been selected', async () => {
      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };
      submittedAppeal[sectionName][taskName].hasSupportingDocuments = false;
      submittedAppeal.sectionStates.appealDocumentsSection.supportingDocuments =
        TASK_STATUS.COMPLETED;

      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      req = {
        ...req,
        body: {
          'supporting-documents': 'no',
        },
        headers: {
          referer: '',
        },
      };

      await postNewSupportingDocuments(req, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${TASK_LIST}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });
  });
});
