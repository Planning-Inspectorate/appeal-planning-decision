const { documentTypes } = require('@pins/common');
const {
  getDecisionLetter,
  postDecisionLetter,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/decision-letter');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const { createDocument } = require('../../../../../src/lib/documents-api-wrapper');
const { getTaskStatus } = require('../../../../../src/services/task.service');
const { APPEAL_DOCUMENT } = require('../../../../../src/lib/empty-appeal');
const TASK_STATUS = require('../../../../../src/services/task-status/task-statuses');
const file = require('../../../../fixtures/file-upload');
const { mockReq, mockRes } = require('../../../mocks');
const {
  VIEW: {
    FULL_APPEAL: { DECISION_LETTER, TASK_LIST },
  },
} = require('../../../../../src/lib/full-appeal/views');

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/lib/documents-api-wrapper');
jest.mock('../../../../../src/services/task.service');

describe('controllers/full-appeal/submit-appeal/decision-letter', () => {
  let req;
  let res;
  let appeal;

  const sectionName = 'planningApplicationDocumentsSection';
  const taskName = documentTypes.decisionLetter.name;
  const appealId = 'da368e66-de7b-44c4-a403-36e5bf5b000b';
  const errors = { 'file-upload': 'Select a file upload' };
  const errorSummary = [{ text: 'There was an error', href: '#' }];

  beforeEach(() => {
    appeal = {
      ...APPEAL_DOCUMENT.empty,
      id: appealId,
      [sectionName]: {
        [taskName]: {
          uploadedFile: file,
        },
      },
    };
    req = {
      ...mockReq(),
      body: {},
      session: {
        appeal,
      },
      sectionName,
      taskName,
    };
    res = mockRes();

    jest.resetAllMocks();
  });

  describe('getDecisionLetter', () => {
    it('should call the correct template', () => {
      getDecisionLetter(req, res);

      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(DECISION_LETTER, {
        appealId,
        uploadedFile: file,
      });
    });
  });

  describe('postDecisionLetter', () => {
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

      await postDecisionLetter(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(DECISION_LETTER, {
        appealId,
        uploadedFile: file,
        errors,
        errorSummary,
      });
    });

    it('should re-render the template with errors if an error is thrown', async () => {
      const error = new Error('Internal Server Error');

      createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

      await postDecisionLetter(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(DECISION_LETTER, {
        appealId,
        uploadedFile: file,
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it('should redirect to the correct page if valid and a file is being uploaded', async () => {
      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };

      createDocument.mockReturnValue(file);
      getTaskStatus.mockReturnValue(TASK_STATUS.NOT_STARTED);
      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      req = {
        ...req,
        body: {},
        files: {
          'file-upload': file,
        },
      };

      await postDecisionLetter(req, res);

      expect(createDocument).toHaveBeenCalledWith(
        appeal,
        file,
        null,
        documentTypes.decisionLetter.name
      );
      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${TASK_LIST}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it('should redirect to the correct page if valid and a file is not being uploaded', async () => {
      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };

      getTaskStatus.mockReturnValue(TASK_STATUS.NOT_STARTED);
      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      await postDecisionLetter(req, res);

      expect(createDocument).not.toHaveBeenCalled();
      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${TASK_LIST}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it('should redirect to the correct page if valid if appeal.planningApplicationDocumentsSection.decisionLetter does not exist', async () => {
      delete appeal.planningApplicationDocumentsSection.decisionLetter;

      const submittedAppeal = {
        ...appeal,
        requiredDocumentsSection: {
          decisionLetter: {
            uploadedFile: file,
          },
        },
        state: 'SUBMITTED',
      };

      createDocument.mockReturnValue(file);
      getTaskStatus.mockReturnValue(TASK_STATUS.NOT_STARTED);
      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      req = {
        ...req,
        body: {},
        files: {
          'file-upload': file,
        },
      };

      await postDecisionLetter(req, res);

      expect(createDocument).toHaveBeenCalledWith(
        appeal,
        file,
        null,
        documentTypes.decisionLetter.name
      );
      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${TASK_LIST}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });
  });
});
