const appeal = require('@pins/business-rules/test/data/full-appeal');
const v8 = require('v8');
const { documentTypes } = require('@pins/common');
const {
  getPlansDrawings,
  postPlansDrawings,
} = require('../../../../../src/controllers/full-appeal/submit-appeal/plans-drawings');
const { createOrUpdateAppeal } = require('../../../../../src/lib/appeals-api-wrapper');
const { createDocument } = require('../../../../../src/lib/documents-api-wrapper');
const TASK_STATUS = require('../../../../../src/services/task-status/task-statuses');
const { mockReq, mockRes } = require('../../../mocks');
const {
  VIEW: {
    FULL_APPEAL: { PLANS_DRAWINGS, PLANNING_OBLIGATION_PLANNED },
  },
} = require('../../../../../src/lib/full-appeal/views');

jest.mock('../../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../../src/lib/documents-api-wrapper');
jest.mock('../../../../../src/services/task.service');

describe('controllers/full-appeal/submit-appeal/plans-drawings', () => {
  let req;
  let res;
  let appealData;

  const sectionName = 'appealDocumentsSection';
  const taskName = 'plansDrawings';
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

  describe('getPlansDrawings', () => {
    it('should call the correct template', () => {
      getPlansDrawings(req, res);

      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(PLANS_DRAWINGS, {
        appealId: appealData.id,
        uploadedFiles: appealData[sectionName][taskName].uploadedFiles,
      });
    });
  });

  describe('postPlansDrawings', () => {
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

      await postPlansDrawings(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(PLANS_DRAWINGS, {
        appealId: appealData.id,
        uploadedFiles: appealData[sectionName][taskName].uploadedFiles,
        errors,
        errorSummary,
      });
    });

    it('should re-render the template with errors if an error is thrown', async () => {
      const error = new Error('Internal Server Error');

      createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));

      await postPlansDrawings(req, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledTimes(1);
      expect(res.render).toHaveBeenCalledWith(PLANS_DRAWINGS, {
        appealId: appealData.id,
        uploadedFiles: appealData[sectionName][taskName].uploadedFiles,
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it('should redirect to the correct page if valid and a single file is being uploaded', async () => {
      appealData.sectionStates.appealDocumentsSection.plansDrawings = TASK_STATUS.COMPLETED;
      appealData[sectionName][taskName].uploadedFiles.pop();
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

      await postPlansDrawings(req, res);

      expect(createDocument).toHaveBeenCalledWith(
        appealData,
        appealData[sectionName][taskName].uploadedFiles[0],
        null,
        documentTypes.decisionPlans.name
      );
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appealData);
      expect(res.redirect).toHaveBeenCalledWith(`/${PLANNING_OBLIGATION_PLANNED}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it('should redirect to the correct page if valid and multiple files are being uploaded', async () => {
      appealData.sectionStates.appealDocumentsSection.plansDrawings = TASK_STATUS.COMPLETED;
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

      await postPlansDrawings(req, res);

      expect(createDocument).toHaveBeenCalledWith(
        appealData,
        appealData[sectionName][taskName].uploadedFiles[0],
        null,
        documentTypes.decisionPlans.name
      );
      expect(createDocument).toHaveBeenCalledWith(
        appealData,
        appealData[sectionName][taskName].uploadedFiles[1],
        null,
        documentTypes.decisionPlans.name
      );
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appealData);
      expect(res.redirect).toHaveBeenCalledWith(`/${PLANNING_OBLIGATION_PLANNED}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it('should redirect to the correct page if valid and a file is not being uploaded', async () => {
      appealData.sectionStates.appealDocumentsSection.plansDrawings = TASK_STATUS.COMPLETED;
      const submittedAppeal = {
        ...appealData,
        state: 'SUBMITTED',
      };

      createOrUpdateAppeal.mockReturnValue(submittedAppeal);

      await postPlansDrawings(req, res);

      expect(createDocument).not.toHaveBeenCalled();
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appealData);
      expect(res.redirect).toHaveBeenCalledWith(`/${PLANNING_OBLIGATION_PLANNED}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });

    it('should replace the previously uploaded files with the newly uploaded file', async () => {
      appealData.sectionStates.appealDocumentsSection.plansDrawings = TASK_STATUS.COMPLETED;
      req.session.appeal[sectionName][taskName].uploadedFiles = [
        appealData[sectionName][taskName].uploadedFiles[0],
        appealData[sectionName][taskName].uploadedFiles[1],
      ];

      const newFile = {
        id: 'a7ef240f-59ec-4f84-9d15-1fc8ccc2de0a',
        name: 'plansDrawings3.pdf',
        fileName: 'plansDrawings3.pdf',
        originalFileName: 'plansDrawings3.pdf',
        location: 'a7ef240f-59ec-4f84-9d15-1fc8ccc2de0a/plansDrawings3.pdf',
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

      await postPlansDrawings(req, res);

      expect(createDocument).toHaveBeenCalledWith(
        appealData,
        newFile,
        null,
        documentTypes.decisionPlans.name
      );
      expect(createOrUpdateAppeal).toHaveBeenCalledWith(appealData);
      expect(res.redirect).toHaveBeenCalledWith(`/${PLANNING_OBLIGATION_PLANNED}`);
      expect(req.session.appeal).toEqual(submittedAppeal);
    });
  });
});
