const uploadDecisionController = require('../../../../src/controllers/appellant-submission/upload-decision');
const { mockReq, mockRes } = require('../../mocks');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const logger = require('../../../../src/lib/logger');
const { VIEW } = require('../../../../src/lib/views');
const { APPEAL_DOCUMENT } = require('../../../../src/lib/empty-appeal');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/lib/logger');

const req = mockReq();
const res = mockRes();

const sectionName = 'requiredDocumentsSection';
const taskName = 'decisionLetter';

describe('controller/appellant-submission/upload-decision', () => {
  describe('getUploadDecision', () => {
    it('should call the correct template', () => {
      uploadDecisionController.getUploadDecision(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.UPLOAD_DECISION, {
        appeal: req.session.appeal,
      });
    });
  });

  describe('postUploadDecision', () => {
    it('should re-render the template with errors if submission validation fails', async () => {
      const mockRequest = {
        ...req,
        body: {
          errors: { a: 'b' },
          errorSummary: [{ text: 'There were errors here', href: '#' }],
        },
        files: {
          'decision-upload': {},
        },
      };
      await uploadDecisionController.postUploadDecision(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.UPLOAD_DECISION, {
        appeal: req.session.appeal,
        errorSummary: [{ text: 'There were errors here', href: '#' }],
        errors: { a: 'b' },
      });
    });

    it('should log an error if the api call fails, and remain on the same page', async () => {
      const error = new Error('API is down');
      createOrUpdateAppeal.mockImplementation(() => Promise.reject(error));
      const mockRequest = {
        ...req,
        body: {},
        files: {},
      };
      await uploadDecisionController.postUploadDecision(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalledWith(error);
      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.UPLOAD_DECISION, {
        appeal: req.session.appeal,
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it('should redirect to `/appellant-submission/task-list` if valid', async () => {
      createOrUpdateAppeal.mockImplementation(() => JSON.stringify({ good: 'data' }));

      const mockRequest = {
        ...req,
        body: {},
        files: {
          'decision-upload': {
            name: 'some name.jpg',
          },
        },
      };
      await uploadDecisionController.postUploadDecision(mockRequest, res);

      const { empty: goodAppeal } = APPEAL_DOCUMENT;
      goodAppeal[sectionName][taskName].uploadedFile = { name: 'some name.jpg' };
      goodAppeal.sectionStates[sectionName][taskName] = 'COMPLETED';

      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.APPELLANT_SUBMISSION.TASK_LIST}`);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith(goodAppeal);
    });
  });
});
