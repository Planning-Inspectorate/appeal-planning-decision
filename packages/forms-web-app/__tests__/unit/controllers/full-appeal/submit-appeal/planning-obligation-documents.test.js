const appeal = require('@pins/business-rules/test/data/full-appeal');
const v8 = require('v8');
const {
  documentTypes: {
    planningObligations: { name: documentType },
  },
} = require('@pins/common');
const {
  getPlanningObligationDocuments,
  postPlanningObligationDocuments,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/planning-obligation-documents');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const { createDocument } = require('../../../../../src/lib/documents-api-wrapper');
const { mockReq, mockRes } = require('../../../mocks');
const {
  VIEW: {
    FULL_APPEAL: { PLANNING_OBLIGATION_DOCUMENTS, NEW_DOCUMENTS },
  },
} = require('../../../../../src/lib/full-appeal/views');

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/lib/documents-api-wrapper');

describe('controllers/full-appeal/submit-appeal/planning-obligation-documents', () => {
  let req;
  let res;
  let appealData;

  const sectionName = 'appealDocumentsSection';
  const taskName = documentType;
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

  describe('getPlanningObligationDocuments', () => {
    it('should call the correct template', () => {
      getPlanningObligationDocuments(req, res);

      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(PLANNING_OBLIGATION_DOCUMENTS, {
        appealId: appealData.id,
        uploadedFiles: appealData[sectionName][taskName].uploadedFiles,
      });
    });
  });

  describe('postPlanningObligationDocuments', () => {
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

      await postPlanningObligationDocuments(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(PLANNING_OBLIGATION_DOCUMENTS, {
        appealId: appealData.id,
        uploadedFiles: appealData[sectionName][taskName].uploadedFiles,
        errors,
        errorSummary,
      });
    });

    it('should re-render the template with errors if an error is thrown', async () => {
      const error = new Error('Internal Server Error');

      createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

      await postPlanningObligationDocuments(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(PLANNING_OBLIGATION_DOCUMENTS, {
        appealId: appealData.id,
        uploadedFiles: appealData[sectionName][taskName].uploadedFiles,
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it('should redirect to the correct page if valid and a single file is being uploaded', async () => {
      appealData[sectionName][taskName].uploadedFiles.pop();
      appealData.sectionStates[sectionName][taskName] = 'COMPLETED';
      req.session.appeal[sectionName][taskName].uploadedFiles = [];

      const submittedAppeal = {
        ...appealData,
        state: 'SUBMITTED',
      };

      createDocument.mockReturnValue(appealData[sectionName][taskName].uploadedFiles[0]);
      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      req = {
        ...req,
        body: {},
        files: {
          'file-upload': appealData[sectionName][taskName].uploadedFiles[0],
        },
      };

      await postPlanningObligationDocuments(req, res);

      expect(createDocument).toHaveBeenCalledWith(
        appealData,
        appealData[sectionName][taskName].uploadedFiles[0],
        null,
        documentType
      );
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appealData);
      expect(res.redirect).toHaveBeenCalledWith(`/${NEW_DOCUMENTS}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it('should redirect to the correct page if valid and multiple files are being uploaded', async () => {
      appealData.sectionStates[sectionName][taskName] = 'COMPLETED';
      req.session.appeal[sectionName][taskName].uploadedFiles = [];

      const submittedAppeal = {
        ...appealData,
        state: 'SUBMITTED',
      };

      createDocument
        .mockReturnValueOnce(appealData[sectionName][taskName].uploadedFiles[0])
        .mockReturnValueOnce(appealData[sectionName][taskName].uploadedFiles[1]);
      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      req = {
        ...req,
        body: {},
        files: {
          'file-upload': appealData[sectionName][taskName].uploadedFiles,
        },
      };

      await postPlanningObligationDocuments(req, res);

      expect(createDocument).toHaveBeenCalledWith(
        appealData,
        appealData[sectionName][taskName].uploadedFiles[0],
        null,
        documentType
      );
      expect(createDocument).toHaveBeenCalledWith(
        appealData,
        appealData[sectionName][taskName].uploadedFiles[1],
        null,
        documentType
      );
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appealData);
      expect(res.redirect).toHaveBeenCalledWith(`/${NEW_DOCUMENTS}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it('should redirect to the correct page if valid and a file is not being uploaded', async () => {
      appealData.sectionStates[sectionName][taskName] = 'COMPLETED';

      const submittedAppeal = {
        ...appealData,
        state: 'SUBMITTED',
      };

      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      await postPlanningObligationDocuments(req, res);

      expect(createDocument).not.toHaveBeenCalled();
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appealData);
      expect(res.redirect).toHaveBeenCalledWith(`/${NEW_DOCUMENTS}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it('should replace the previously uploaded files with the newly uploaded file', async () => {
      appealData.sectionStates[sectionName][taskName] = 'COMPLETED';
      req.session.appeal[sectionName][taskName].uploadedFiles = [
        appealData[sectionName][taskName].uploadedFiles[0],
        appealData[sectionName][taskName].uploadedFiles[1],
      ];

      const newFile = {
        id: 'a7ef240f-59ec-4f84-9d15-1fc8ccc2de0a',
        name: 'plansDrawingsSupportingDocuments3.pdf',
        fileName: 'plansDrawingsSupportingDocuments3.pdf',
        originalFileName: 'plansDrawingsSupportingDocuments3.pdf',
        location: 'a7ef240f-59ec-4f84-9d15-1fc8ccc2de0a/plansDrawingsSupportingDocuments3.pdf',
        size: 1000,
      };
      const submittedAppeal = {
        ...appealData,
        state: 'SUBMITTED',
      };
      submittedAppeal[sectionName][taskName].uploadedFiles = [newFile];

      createDocument.mockReturnValue(newFile);
      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      req = {
        ...req,
        body: {},
        files: {
          'file-upload': newFile,
        },
      };

      await postPlanningObligationDocuments(req, res);

      expect(createDocument).toHaveBeenCalledWith(appealData, newFile, null, documentType);
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appealData);
      expect(res.redirect).toHaveBeenCalledWith(`/${NEW_DOCUMENTS}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });
  });
});
