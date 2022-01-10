const { documentTypes } = require('@pins/common');
const {
  getDesignAccessStatement,
  postDesignAccessStatement,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/design-access-statement');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const { createDocument } = require('../../../../../src/lib/documents-api-wrapper');
const { getTaskStatus } = require('../../../../../src/services/task.service');
const { APPEAL_DOCUMENT } = require('../../../../../src/lib/empty-appeal');
const TASK_STATUS = require('../../../../../src/services/task-status/task-statuses');
const file = require('../../../../fixtures/file-upload');
const { mockReq, mockRes } = require('../../../mocks');
const {
  VIEW: {
    FULL_APPEAL: { DESIGN_ACCESS_STATEMENT, DECISION_LETTER },
  },
} = require('../../../../../src/lib/full-appeal/views');

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/lib/documents-api-wrapper');
jest.mock('../../../../../src/services/task.service');

describe('controllers/full-appeal/submit-appeal/design-access-statement', () => {
  let req;
  let res;
  let appeal;

  const sectionName = 'requiredDocumentsSection';
  const taskName = documentTypes.designAccessStatement.name;
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
    };
    res = mockRes();

    jest.resetAllMocks();
  });

  describe('getDesignAccessStatement', () => {
    it('should call the correct template', () => {
      getDesignAccessStatement(req, res);

      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(DESIGN_ACCESS_STATEMENT, {
        appealId,
        uploadedFile: file,
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
        appealId,
        uploadedFile: file,
        errors,
        errorSummary,
      });
    });

    it('should re-render the template with errors if an error is thrown', async () => {
      const error = new Error('Internal Server Error');

      createDocument.mockImplementation(() => Promise.reject(error));

      await postDesignAccessStatement(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(DESIGN_ACCESS_STATEMENT, {
        appealId,
        uploadedFile: file,
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it('should redirect to the correct page if valid', async () => {
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

      await postDesignAccessStatement(req, res);

      expect(createDocument).toHaveBeenCalledWith(
        appeal,
        file,
        null,
        documentTypes.designAccessStatement.name
      );
      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${DECISION_LETTER}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it('should redirect to the correct page if valid if appeal.requiredDocumentsSection.designAccessStatement does not exist', async () => {
      delete appeal.requiredDocumentsSection.designAccessStatement;

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

      await postDesignAccessStatement(req, res);

      expect(createDocument).toHaveBeenCalledWith(
        appeal,
        file,
        null,
        documentTypes.designAccessStatement.name
      );
      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${DECISION_LETTER}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });
  });
});
