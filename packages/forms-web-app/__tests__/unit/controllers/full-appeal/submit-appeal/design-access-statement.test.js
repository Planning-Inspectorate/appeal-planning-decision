const {
  constants: {
    APPLICATION_DECISION: { GRANTED, NODECISIONRECEIVED, REFUSED },
  },
} = require('@pins/business-rules');
const appeal = require('@pins/business-rules/test/data/full-appeal');
const v8 = require('v8');
const { documentTypes } = require('@pins/common');
const {
  getDesignAccessStatement,
  postDesignAccessStatement,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/design-access-statement');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const { createDocument } = require('../../../../../src/lib/documents-api-wrapper');
const TASK_STATUS = require('../../../../../src/services/task-status/task-statuses');
const { mockReq, mockRes } = require('../../../mocks');
const {
  VIEW: {
    FULL_APPEAL: { DESIGN_ACCESS_STATEMENT, LETTER_CONFIRMING_APPLICATION, TASK_LIST },
  },
} = require('../../../../../src/lib/full-appeal/views');

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/lib/documents-api-wrapper');
jest.mock('../../../../../src/services/task.service');

describe('controllers/full-appeal/submit-appeal/design-access-statement', () => {
  let req;
  let res;

  const sectionName = 'planningApplicationDocumentsSection';
  const taskName = documentTypes.designAccessStatement.name;
  const errors = { 'file-upload': 'Select a file upload' };
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

  describe('getDesignAccessStatement', () => {
    it('should call the correct template', () => {
      getDesignAccessStatement(req, res);

      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(DESIGN_ACCESS_STATEMENT, {
        appealId: appeal.id,
        uploadedFile: appeal[sectionName][taskName].uploadedFile,
      });
    });
  });

  describe('postDesignAccessStatement', () => {
    it('should re-render the template with errors if submission validation fails', async () => {
      req = {
        ...req,
        body: {
          errors,
          errorSummary,
        },
        files: {
          'file-upload': {},
        },
      };

      await postDesignAccessStatement(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(DESIGN_ACCESS_STATEMENT, {
        appealId: appeal.id,
        uploadedFile: appeal[sectionName][taskName].uploadedFile,
        errorSummary,
        errors,
      });
    });

    it('should re-render the template with errors if an error is thrown', async () => {
      const error = new Error('Internal Server Error');

      createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

      await postDesignAccessStatement(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(DESIGN_ACCESS_STATEMENT, {
        appealId: appeal.id,
        uploadedFile: appeal[sectionName][taskName].uploadedFile,
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it('should redirect to the correct page if valid and the application decision is `granted` and a file is being uploaded', async () => {
      appeal.sectionStates.planningApplicationDocumentsSection.designAccessStatement =
        TASK_STATUS.COMPLETED;
      appeal.eligibility.applicationDecision = GRANTED;
      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };

      createDocument.mockReturnValue(appeal[sectionName][taskName].uploadedFile);
      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      req = {
        ...req,
        body: {},
        files: {
          'file-upload': appeal[sectionName][taskName].uploadedFile,
        },
      };
      req.session.appeal.eligibility.applicationDecision = GRANTED;

      await postDesignAccessStatement(req, res);

      expect(createDocument).toHaveBeenCalledWith(
        appeal,
        appeal[sectionName][taskName].uploadedFile,
        null,
        taskName
      );
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${LETTER_CONFIRMING_APPLICATION}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it('should redirect to the correct page if valid and the application decision is `refused` and a file is being uploaded', async () => {
      appeal.sectionStates.planningApplicationDocumentsSection.designAccessStatement =
        TASK_STATUS.COMPLETED;
      appeal.eligibility.applicationDecision = REFUSED;
      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };

      createDocument.mockReturnValue(appeal[sectionName][taskName].uploadedFile);
      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      req = {
        ...req,
        body: {},
        files: {
          'file-upload': appeal[sectionName][taskName].uploadedFile,
        },
      };
      req.session.appeal.eligibility.applicationDecision = REFUSED;

      await postDesignAccessStatement(req, res);

      expect(createDocument).toHaveBeenCalledWith(
        appeal,
        appeal[sectionName][taskName].uploadedFile,
        null,
        taskName
      );
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${LETTER_CONFIRMING_APPLICATION}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it('should redirect to the correct page if valid and the application decision is `no decision received` and a file is being uploaded', async () => {
      appeal.sectionStates.planningApplicationDocumentsSection.designAccessStatement =
        TASK_STATUS.COMPLETED;
      appeal.eligibility.applicationDecision = NODECISIONRECEIVED;
      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };

      createDocument.mockReturnValue(appeal[sectionName][taskName].uploadedFile);
      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      req = {
        ...req,
        body: {},
        files: {
          'file-upload': appeal[sectionName][taskName].uploadedFile,
        },
      };
      req.session.appeal.eligibility.applicationDecision = NODECISIONRECEIVED;

      await postDesignAccessStatement(req, res);

      expect(createDocument).toHaveBeenCalledWith(
        appeal,
        appeal[sectionName][taskName].uploadedFile,
        null,
        taskName
      );
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${TASK_LIST}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it('should redirect to the correct page if valid and the application decision is `granted` and a file is not being uploaded', async () => {
      appeal.sectionStates.planningApplicationDocumentsSection.designAccessStatement =
        TASK_STATUS.COMPLETED;
      appeal.eligibility.applicationDecision = GRANTED;
      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };
      req.session.appeal.eligibility.applicationDecision = GRANTED;

      createDocument.mockReturnValue(appeal[sectionName][taskName].uploadedFile);
      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      await postDesignAccessStatement(req, res);

      expect(createDocument).not.toHaveBeenCalled();
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${LETTER_CONFIRMING_APPLICATION}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it('should redirect to the correct page if valid and the application decision is `refused` and a file is not being uploaded', async () => {
      appeal.sectionStates.planningApplicationDocumentsSection.designAccessStatement =
        TASK_STATUS.COMPLETED;
      appeal.eligibility.applicationDecision = REFUSED;
      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };
      req.session.appeal.eligibility.applicationDecision = REFUSED;

      createDocument.mockReturnValue(appeal[sectionName][taskName].uploadedFile);
      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      await postDesignAccessStatement(req, res);

      expect(createDocument).not.toHaveBeenCalled();
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${LETTER_CONFIRMING_APPLICATION}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it('should redirect to the correct page if valid and the application decision is `no decision received` and a file is not being uploaded', async () => {
      appeal.sectionStates.planningApplicationDocumentsSection.designAccessStatement =
        TASK_STATUS.COMPLETED;
      appeal.eligibility.applicationDecision = NODECISIONRECEIVED;
      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };
      req.session.appeal.eligibility.applicationDecision = NODECISIONRECEIVED;

      createDocument.mockReturnValue(appeal[sectionName][taskName].uploadedFile);
      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      await postDesignAccessStatement(req, res);

      expect(createDocument).not.toHaveBeenCalled();
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${TASK_LIST}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });
  });
});
