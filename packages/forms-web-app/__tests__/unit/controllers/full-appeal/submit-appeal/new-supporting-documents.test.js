const appeal = require('@pins/business-rules/test/data/full-appeal');
const v8 = require('v8');
const { documentTypes } = require('@pins/common');
const {
  getNewSupportingDocuments,
  postNewSupportingDocuments,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/new-supporting-documents');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const { createDocument } = require('../../../../../src/lib/documents-api-wrapper');
const { getTaskStatus } = require('../../../../../src/services/task.service');
const TASK_STATUS = require('../../../../../src/services/task-status/task-statuses');
const { mockReq, mockRes } = require('../../../mocks');
const {
  VIEW: {
    FULL_APPEAL: { NEW_SUPPORTING_DOCUMENTS, TASK_LIST },
  },
} = require('../../../../../src/lib/full-appeal/views');

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/lib/documents-api-wrapper');
jest.mock('../../../../../src/services/task.service');

describe('controllers/full-appeal/submit-appeal/new-supporting-documents', () => {
  let req;
  let res;
  let appealData;

  const sectionName = 'appealDocumentsSection';
  const taskName = 'supportingDocuments';
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
    appealData = v8.deserialize(v8.serialize(appeal));

    jest.resetAllMocks();
  });

  describe('getNewSupportingDocuments', () => {
    it('should call the correct template', () => {
      getNewSupportingDocuments(req, res);

      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(NEW_SUPPORTING_DOCUMENTS, {
        appealId: appealData.id,
        uploadedFiles: appealData[sectionName][taskName].uploadedFiles,
      });
    });
  });

  describe('postNewSupportingDocuments', () => {
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

      await postNewSupportingDocuments(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(NEW_SUPPORTING_DOCUMENTS, {
        appealId: appealData.id,
        uploadedFiles: appealData[sectionName][taskName].uploadedFiles,
        errors,
        errorSummary,
      });
    });

    it('should re-render the template with errors if an error is thrown', async () => {
      const error = new Error('Internal Server Error');

      createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

      await postNewSupportingDocuments(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(NEW_SUPPORTING_DOCUMENTS, {
        appealId: appealData.id,
        uploadedFiles: appealData[sectionName][taskName].uploadedFiles,
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it('should redirect to the correct page if valid and a single file is being uploaded', async () => {
      appealData[sectionName][taskName].uploadedFiles.pop();
      req.session.appeal[sectionName][taskName].uploadedFiles = [];

      const submittedAppeal = {
        ...appealData,
        state: 'SUBMITTED',
      };

      createDocument.mockReturnValue(appealData[sectionName][taskName].uploadedFiles[0]);
      getTaskStatus.mockReturnValue(TASK_STATUS.NOT_STARTED);
      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      req = {
        ...req,
        body: {},
        files: {
          'file-upload': appealData[sectionName][taskName].uploadedFiles[0],
        },
      };

      await postNewSupportingDocuments(req, res);

      expect(createDocument).toHaveBeenCalledWith(
        appealData,
        appealData[sectionName][taskName].uploadedFiles[0],
        null,
        documentTypes.otherDocuments.name
      );
      // expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appealData);
      expect(res.redirect).toHaveBeenCalledWith(`/${TASK_LIST}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it('should redirect to the correct page if valid and multiple files are being uploaded', async () => {
      req.session.appeal[sectionName][taskName].uploadedFiles = [];

      const submittedAppeal = {
        ...appealData,
        state: 'SUBMITTED',
      };

      createDocument
        .mockReturnValueOnce(appealData[sectionName][taskName].uploadedFiles[0])
        .mockReturnValueOnce(appealData[sectionName][taskName].uploadedFiles[1]);
      getTaskStatus.mockReturnValue(TASK_STATUS.NOT_STARTED);
      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      req = {
        ...req,
        body: {},
        files: {
          'file-upload': appealData[sectionName][taskName].uploadedFiles,
        },
      };

      await postNewSupportingDocuments(req, res);

      expect(createDocument).toHaveBeenCalledWith(
        appealData,
        appealData[sectionName][taskName].uploadedFiles[0],
        null,
        documentTypes.otherDocuments.name
      );
      expect(createDocument).toHaveBeenCalledWith(
        appealData,
        appealData[sectionName][taskName].uploadedFiles[1],
        null,
        documentTypes.otherDocuments.name
      );
      // expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appealData);
      expect(res.redirect).toHaveBeenCalledWith(`/${TASK_LIST}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it('should redirect to the correct page if valid and a file is not being uploaded', async () => {
      const submittedAppeal = {
        ...appealData,
        state: 'SUBMITTED',
      };

      getTaskStatus.mockReturnValue(TASK_STATUS.NOT_STARTED);
      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      await postNewSupportingDocuments(req, res);

      expect(createDocument).not.toHaveBeenCalled();
      // expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appealData);
      expect(res.redirect).toHaveBeenCalledWith(`/${TASK_LIST}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it('should replace the previously uploaded files with the newly uploaded file', async () => {
      req.session.appeal[sectionName][taskName].uploadedFiles = [
        appealData[sectionName][taskName].uploadedFiles[0],
        appealData[sectionName][taskName].uploadedFiles[1],
      ];

      const newFile = {
        id: 'a7ef240f-59ec-4f84-9d15-1fc8ccc2de0a',
        name: 'supportingDocuments3.pdf',
        fileName: 'supportingDocuments3.pdf',
        originalFileName: 'supportingDocuments3.pdf',
        location: 'a7ef240f-59ec-4f84-9d15-1fc8ccc2de0a/supportingDocuments3.pdf',
        size: 1000,
      };
      const submittedAppeal = {
        ...appealData,
        state: 'SUBMITTED',
      };
      submittedAppeal[sectionName][taskName].uploadedFiles = [newFile];

      createDocument.mockReturnValue(newFile);
      getTaskStatus.mockReturnValue(TASK_STATUS.NOT_STARTED);
      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      req = {
        ...req,
        body: {},
        files: {
          'file-upload': newFile,
        },
      };

      await postNewSupportingDocuments(req, res);

      expect(createDocument).toHaveBeenCalledWith(
        appealData,
        newFile,
        null,
        documentTypes.otherDocuments.name
      );
      // expect(getTaskStatus).toHaveBeenCalledWith(appeal, sectionName, taskName);
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appealData);
      expect(res.redirect).toHaveBeenCalledWith(`/${TASK_LIST}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });
  });
});
