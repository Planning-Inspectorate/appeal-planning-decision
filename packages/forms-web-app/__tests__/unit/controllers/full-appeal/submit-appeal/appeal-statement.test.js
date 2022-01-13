const { documentTypes } = require('@pins/common');
const {
  getAppealStatement,
  postAppealStatement,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/appeal-statement');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const { createDocument } = require('../../../../../src/lib/documents-api-wrapper');
const { getTaskStatus } = require('../../../../../src/services/task.service');
const { APPEAL_DOCUMENT } = require('../../../../../src/lib/empty-appeal');
const TASK_STATUS = require('../../../../../src/services/task-status/task-statuses');
const file = require('../../../../fixtures/file-upload');
const { mockReq, mockRes } = require('../../../mocks');
const {
  VIEW: {
    FULL_APPEAL: { APPEAL_STATEMENT, PLANS_DRAWINGS },
  },
} = require('../../../../../src/lib/full-appeal/views');

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/lib/documents-api-wrapper');
jest.mock('../../../../../src/services/task.service');

describe('controllers/full-appeal/submit-appeal/appeal-statement', () => {
  let req;
  let res;
  let appeal;

  const sectionName = 'yourAppealSection';
  const taskName = documentTypes.appealStatement.name;
  const appealId = 'da368e66-de7b-44c4-a403-36e5bf5b000b';
  const fileUploadError = 'Select a file upload';
  const checkboxError = 'Select to confirm you have not included sensitive information';
  const errors = {
    'file-upload': fileUploadError,
    'does-not-include-sensitive-information': checkboxError,
  };
  const errorSummary = [
    { text: fileUploadError, href: '#' },
    { text: checkboxError, href: '#' },
  ];

  beforeEach(() => {
    appeal = {
      ...APPEAL_DOCUMENT.empty,
      id: appealId,
      [sectionName]: {
        [taskName]: {
          uploadedFile: file,
          hasSensitiveInformation: false,
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

  describe('getAppealStatement', () => {
    it('should call the correct template', () => {
      getAppealStatement(req, res);

      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(APPEAL_STATEMENT, {
        appealId,
        uploadedFile: file,
        hasSensitiveInformation: false,
      });
    });
  });

  describe('postAppealStatement', () => {
    it('should re-render the template with errors if submission validation fails', async () => {
      req = {
        ...req,
        body: {
          errors,
          errorSummary,
        },
        files: {
          'file-upload': {},
          'does-not-include-sensitive-information': undefined,
        },
      };

      await postAppealStatement(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(APPEAL_STATEMENT, {
        appealId,
        uploadedFile: file,
        hasSensitiveInformation: true,
        errors,
        errorSummary,
      });
    });

    it('should re-render the template with errors if an error is thrown', async () => {
      const error = new Error('Internal Server Error');

      createDocument.mockImplementation(() => Promise.reject(error));

      await postAppealStatement(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(APPEAL_STATEMENT, {
        appealId,
        uploadedFile: file,
        hasSensitiveInformation: true,
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
          'does-not-include-sensitive-information': 'i-confirm',
        },
      };

      await postAppealStatement(req, res);

      expect(createDocument).toHaveBeenCalledWith(
        appeal,
        file,
        null,
        documentTypes.appealStatement.name
      );
      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${PLANS_DRAWINGS}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it('should redirect to the correct page if valid if appeal.yourAppealSection.appealStatement does not exist', async () => {
      delete appeal.yourAppealSection.appealStatement;

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
          'does-not-include-sensitive-information': 'i-confirm',
        },
      };

      await postAppealStatement(req, res);

      expect(createDocument).toHaveBeenCalledWith(
        appeal,
        file,
        null,
        documentTypes.appealStatement.name
      );
      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${PLANS_DRAWINGS}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });
  });
});
