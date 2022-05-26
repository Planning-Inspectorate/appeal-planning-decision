const v8 = require('v8');
const { documentTypes } = require('@pins/common');
const appeal = require('../../../../mockData/full-appeal');
const {
  getLetterConfirmingApplication,
  postLetterConfirmingApplication,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/letter-confirming-application');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const { createDocument } = require('../../../../../src/lib/documents-api-wrapper');
const TASK_STATUS = require('../../../../../src/services/task-status/task-statuses');
const { mockReq, mockRes } = require('../../../mocks');
const {
  VIEW: {
    FULL_APPEAL: { LETTER_CONFIRMING_APPLICATION, TASK_LIST },
  },
} = require('../../../../../src/lib/full-appeal/views');

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/lib/documents-api-wrapper');
jest.mock('../../../../../src/services/task.service');

describe('controllers/full-appeal/submit-appeal/letter-confirming-application ', () => {
  let req;
  let res;

  const sectionName = 'planningApplicationDocumentsSection';
  const taskName = documentTypes.letterConfirmingApplication.name;
  const errors = { 'file-upload': 'Select your letter confirming application file' };
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

  describe('getLetterConfirmingApplication', () => {
    it('should call the correct template', () => {
      getLetterConfirmingApplication(req, res);
      expect(res.render).toHaveBeenCalledWith(LETTER_CONFIRMING_APPLICATION, {
        appealId: appeal.id,
        uploadedFile: appeal[sectionName][taskName].uploadedFile,
      });
    });
  });

  describe('postLetterConfirmingApplication', () => {
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

      await postLetterConfirmingApplication(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(LETTER_CONFIRMING_APPLICATION, {
        appealId: appeal.id,
        uploadedFile: appeal[sectionName][taskName].uploadedFile,
        errorSummary,
        errors,
      });
    });

    it('should re-render the template with errors if an error is thrown', async () => {
      const error = new Error('Internal Server Error');

      createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

      await postLetterConfirmingApplication(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(LETTER_CONFIRMING_APPLICATION, {
        appealId: appeal.id,
        uploadedFile: appeal[sectionName][taskName].uploadedFile,
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it('should redirect to the correct page if valid and a file is being uploaded', async () => {
      appeal.sectionStates.planningApplicationDocumentsSection.letterConfirmingApplication =
        TASK_STATUS.COMPLETED;
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

      await postLetterConfirmingApplication(req, res);

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

    it('should redirect to the correct page if valid and a file is not being uploaded', async () => {
      appeal.sectionStates.planningApplicationDocumentsSection.letterConfirmingApplication =
        TASK_STATUS.COMPLETED;
      const submittedAppeal = {
        ...appeal,
        state: 'SUBMITTED',
      };

      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      await postLetterConfirmingApplication(req, res);

      expect(createDocument).not.toHaveBeenCalled();
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appeal);
      expect(res.redirect).toHaveBeenCalledWith(`/${TASK_LIST}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });
  });
});