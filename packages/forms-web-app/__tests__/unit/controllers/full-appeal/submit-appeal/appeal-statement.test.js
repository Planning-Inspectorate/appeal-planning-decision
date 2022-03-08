const appeal = require('@pins/business-rules/test/data/full-appeal');
const v8 = require('v8');
const { documentTypes } = require('@pins/common');
const {
  getAppealStatement,
  postAppealStatement,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/appeal-statement');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const { createDocument } = require('../../../../../src/lib/documents-api-wrapper');
const TASK_STATUS = require('../../../../../src/services/task-status/task-statuses');
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

  const sectionName = 'appealDocumentsSection';
  const taskName = documentTypes.appealStatement.name;
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
    req = v8.deserialize(
      v8.serialize({
        ...mockReq(appeal),
        body: {},
      })
    );
    res = mockRes();

    jest.resetAllMocks();
  });

  describe('getAppealStatement', () => {
    it('should call the correct template', () => {
      getAppealStatement(req, res);

      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(APPEAL_STATEMENT, {
        appealId: appeal.id,
        uploadedFile: appeal[sectionName][taskName].uploadedFile,
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
        appealId: appeal.id,
        uploadedFile: appeal[sectionName][taskName].uploadedFile,
        hasSensitiveInformation: true,
        errorSummary,
        errors,
      });
    });

    it('should re-render the template with errors if an error is thrown', async () => {
      const error = new Error('Internal Server Error');

      createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

      await postAppealStatement(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(APPEAL_STATEMENT, {
        appealId: appeal.id,
        uploadedFile: appeal[sectionName][taskName].uploadedFile,
        hasSensitiveInformation: true,
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it('should redirect to the correct page if valid and a file is being uploaded', async () => {
      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };
      submittedAppeal[sectionName][taskName].hasSensitiveInformation = true;
      submittedAppeal.sectionStates.appealDocumentsSection.appealStatement = TASK_STATUS.COMPLETED;

      createDocument.mockReturnValue(appeal[sectionName][taskName].uploadedFile);
      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      req = {
        ...req,
        body: {},
        files: {
          'file-upload': appeal[sectionName][taskName].uploadedFile,
          'does-not-include-sensitive-information': 'i-confirm',
        },
      };

      await postAppealStatement(req, res);

      expect(createDocument).toHaveBeenCalledWith(
        appeal,
        appeal[sectionName][taskName].uploadedFile,
        null,
        taskName
      );
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${PLANS_DRAWINGS}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it('should redirect to the correct page if valid and a file is not being uploaded', async () => {
      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };
      submittedAppeal.sectionStates.appealDocumentsSection.appealStatement = TASK_STATUS.COMPLETED;

      createDocument.mockReturnValue(appeal[sectionName][taskName].uploadedFile);
      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      await postAppealStatement(req, res);

      expect(createDocument).not.toHaveBeenCalled();
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${PLANS_DRAWINGS}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });
  });
});
