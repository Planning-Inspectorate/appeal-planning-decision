const appealStatementController = require('../../../../src/controllers/appellant-submission/appeal-statement');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const { createDocument } = require('../../../../src/lib/documents-api-wrapper');
const { mockReq, mockRes } = require('../../mocks');
const logger = require('../../../../src/lib/logger');
const { getNextTask } = require('../../../../src/services/task.service');
const { APPEAL_DOCUMENT } = require('../../../../src/lib/empty-appeal');
const { getTaskStatus } = require('../../../../src/services/task.service');
const { VIEW } = require('../../../../src/lib/views');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/lib/documents-api-wrapper');
jest.mock('../../../../src/services/task.service');
jest.mock('../../../../src/lib/logger');

const sectionName = 'yourAppealSection';
const taskName = 'appealStatement';

describe('controllers/appellant-submission/appeal-statement', () => {
  let req;
  let res;
  let appeal;

  beforeEach(() => {
    req = mockReq();
    res = mockRes();

    ({ empty: appeal } = APPEAL_DOCUMENT);

    jest.resetAllMocks();
  });

  describe('getAppealStatement', () => {
    it('should call the correct template', async () => {
      await appealStatementController.getAppealStatement(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.APPEAL_STATEMENT, {
        appeal: req.session.appeal,
      });
    });
  });

  describe('postAppealStatement', () => {
    it('should re-render the template with errors if submission validation fails', async () => {
      const mockRequest = {
        ...req,
        body: {
          errors: { a: 'b' },
          errorSummary: [{ text: 'There were errors here', href: '#' }],
        },
      };
      await appealStatementController.postAppealStatement(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.APPEAL_STATEMENT, {
        appeal: {
          ...req.session.appeal,
          [sectionName]: {
            ...req.session.appeal[sectionName],
            [taskName]: {
              hasSensitiveInformation: null,
              uploadedFile: {
                id: null,
                name: '',
              },
            },
          },
        },
        errors: { a: 'b' },
        errorSummary: [{ text: 'There were errors here', href: '#' }],
      });
    });

    it('should redirect back to `/appellant-submission/appeal-statement` if validation passes but `i-confirm` not given', async () => {
      const mockRequest = {
        ...req,
        body: {
          'does-not-include-sensitive-information': 'anything here - not valid',
        },
        files: {
          'appeal-upload': {},
        },
      };
      await appealStatementController.postAppealStatement(mockRequest, res);

      expect(getTaskStatus).not.toHaveBeenCalled();

      expect(res.redirect).toHaveBeenCalledWith('/appellant-submission/appeal-statement');
    });

    it('should log an error if the api call fails, and remain on the same page', async () => {
      const error = new Error('API is down');
      createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));
      const mockRequest = {
        ...req,
        body: {
          'does-not-include-sensitive-information': 'i-confirm',
        },
        files: {},
      };
      await appealStatementController.postAppealStatement(mockRequest, res);

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalledWith(error);
      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.APPEAL_STATEMENT, {
        appeal: req.session.appeal,
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it('should not require req.files to be valid', async () => {
      const fakeTaskStatus = 'FAKE_STATUS';
      getTaskStatus.mockImplementation(() => fakeTaskStatus);

      getNextTask.mockReturnValue({
        href: `/${VIEW.APPELLANT_SUBMISSION.SUPPORTING_DOCUMENTS}`,
      });

      const mockRequest = {
        ...req,
        body: {
          'does-not-include-sensitive-information': 'i-confirm',
        },
      };
      await appealStatementController.postAppealStatement(mockRequest, res);

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);

      expect(createDocument).not.toHaveBeenCalled();

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...appeal,
        [sectionName]: {
          ...appeal[sectionName],
          [taskName]: {
            hasSensitiveInformation: false,
            uploadedFile: {
              id: null,
              name: '',
            },
          },
        },
        sectionStates: {
          ...appeal.sectionStates,
          [sectionName]: {
            ...appeal.sectionStates[sectionName],
            [taskName]: fakeTaskStatus,
          },
        },
      });

      expect(res.redirect).toHaveBeenCalledWith(
        `/${VIEW.APPELLANT_SUBMISSION.SUPPORTING_DOCUMENTS}`
      );
    });

    it('should redirect to `/appellant-submission/supporting-documents` if valid', async () => {
      const fakeFileId = '123-abc';
      const fakeFileName = 'some name.jpg';
      const fakeTaskStatus = 'ANOTHER_FAKE_STATUS';
      const fakeNextUrl = `/${VIEW.APPELLANT_SUBMISSION.SUPPORTING_DOCUMENTS}`;

      getTaskStatus.mockImplementation(() => fakeTaskStatus);

      createDocument.mockImplementation(() => ({ id: fakeFileId }));
      getNextTask.mockReturnValue({
        href: fakeNextUrl,
      });

      const mockRequest = {
        ...req,
        body: {
          'does-not-include-sensitive-information': 'i-confirm',
        },
        files: {
          'appeal-upload': {
            name: fakeFileName,
          },
        },
      };
      await appealStatementController.postAppealStatement(mockRequest, res);

      expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);

      expect(createDocument).toHaveBeenCalledWith(appeal, { name: fakeFileName });

      expect(createOrUpdateAppeal).toHaveBeenCalledWith({
        ...appeal,
        [sectionName]: {
          ...appeal[sectionName],
          [taskName]: {
            hasSensitiveInformation: false,
            uploadedFile: {
              id: fakeFileId,
              name: fakeFileName,
            },
          },
        },
        sectionStates: {
          ...appeal.sectionStates,
          [sectionName]: {
            ...appeal.sectionStates[sectionName],
            [taskName]: fakeTaskStatus,
          },
        },
      });

      expect(res.redirect).toHaveBeenCalledWith(fakeNextUrl);
    });
  });
});
