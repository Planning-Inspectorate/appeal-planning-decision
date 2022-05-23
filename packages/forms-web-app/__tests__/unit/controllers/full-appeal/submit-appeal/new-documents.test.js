const appeal = require('@pins/business-rules/test/data/full-appeal');
const v8 = require('v8');
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
    it('should call the correct template', () => {
      getNewSupportingDocuments(req, res);

      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(NEW_DOCUMENTS, {
        hasSupportingDocuments: true,
        hasPlansDrawings: true,
        backLink: `/${PLANNING_OBLIGATION_PLANNED}`,
      });
    });
  });

  describe('postNewSupportingDocuments', () => {
    it('should re-render the template with errors if submission validation fails', async () => {
      req = {
        ...req,
        body: {
          'supporting-documents': undefined,
          errors,
          errorSummary,
        },
      };

      await postNewSupportingDocuments(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(NEW_DOCUMENTS, {
        hasPlansDrawings: true,
        errors,
        errorSummary,
      });
    });

    it('should re-render the template with errors if an error is thrown', async () => {
      const error = new Error('Internal Server Error');

      createOrUpdateAppeal.mockImplementation(() => {
        throw error;
      });

      await postNewSupportingDocuments(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(NEW_DOCUMENTS, {
        hasSupportingDocuments: false,
        hasPlansDrawings: true,
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
      };

      await postNewSupportingDocuments(req, res);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${TASK_LIST}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });
  });
});
