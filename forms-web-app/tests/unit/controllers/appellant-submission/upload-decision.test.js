const uploadDecisionController = require('../../../../src/controllers/appellant-submission/upload-decision');
const { mockReq, mockRes } = require('../../mocks');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const logger = require('../../../../src/lib/logger');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/lib/logger');

const req = mockReq();
const res = mockRes();

describe('controller/appellant-submission/upload-decision', () => {
  describe('getUploadDecision', () => {
    it('should call the correct template', () => {
      uploadDecisionController.getUploadDecision(req, res);

      expect(res.render).toHaveBeenCalledWith('appellant-submission/upload-decision', {
        appeal: undefined,
      });
    });
  });

  describe('postUploadDecision', () => {
    it('should re-render the template with errors if submission validation fails', async () => {
      const mockRequest = {
        ...req,
        body: {
          errors: { a: 'b' },
          errorSummary: { a: { msg: 'There were errors here' } },
        },
        files: {
          'upload-decision': {},
        },
      };
      await uploadDecisionController.postUploadDecision(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith('appellant-submission/upload-decision', {
        appeal: {
          'upload-decision': {},
        },
        errorSummary: { a: { msg: 'There were errors here' } },
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
    });

    it('should redirect to `/appellant-submission/task-list` if valid', async () => {
      createOrUpdateAppeal.mockImplementation(() => JSON.stringify({ good: 'data' }));

      const mockRequest = {
        ...req,
        body: {},
        files: {
          'upload-decision': {
            name: 'some name.jpg',
          },
        },
      };
      await uploadDecisionController.postUploadDecision(mockRequest, res);

      expect(res.redirect).toHaveBeenCalledWith('/appellant-submission/task-list');
    });
  });
});
