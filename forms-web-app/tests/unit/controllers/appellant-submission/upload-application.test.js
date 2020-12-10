const uploadApplicationController = require('../../../../src/controllers/appellant-submission/upload-application');
const { mockReq, mockRes } = require('../../mocks');
const { createOrUpdateAppeal } = require('../../../../src/lib/appeals-api-wrapper');
const logger = require('../../../../src/lib/logger');
const { EMPTY_APPEAL } = require('../../../../src/lib/appeals-api-wrapper');
const { VIEW } = require('../../../../src/lib/views');

jest.mock('../../../../src/lib/appeals-api-wrapper');
jest.mock('../../../../src/lib/logger');

const req = mockReq();
const res = mockRes();

const sectionName = 'requiredDocumentsSection';
const taskName = 'originalApplication';

describe('controller/appellant-submission/upload-application', () => {
  describe('getUploadApplication', () => {
    it('should call the correct template', () => {
      uploadApplicationController.getUploadApplication(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.UPLOAD_APPLICATION, {
        appeal: req.session.appeal,
      });
    });
  });

  describe('postUploadApplication', () => {
    it('should re-render the template with errors if submission validation fails', async () => {
      const mockRequest = {
        ...req,
        body: {
          errors: { a: 'b' },
          errorSummary: [{ text: 'There were errors here', href: '#' }],
        },
        files: {
          'application-upload': {},
        },
      };
      await uploadApplicationController.postUploadApplication(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.UPLOAD_APPLICATION, {
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
      await uploadApplicationController.postUploadApplication(mockRequest, res);

      expect(res.redirect).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalledWith(error);
      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.UPLOAD_APPLICATION, {
        appeal: req.session.appeal,
        errors: {},
        errorSummary: [{ text: error.toString(), href: '#' }],
      });
    });

    it('should redirect to `/appellant-submission/supporting-documents` if valid', async () => {
      createOrUpdateAppeal.mockImplementation(() => JSON.stringify({ good: 'data' }));

      const mockRequest = {
        ...req,
        body: {},
        files: {
          'application-upload': {
            name: 'some name.jpg',
          },
        },
      };
      await uploadApplicationController.postUploadApplication(mockRequest, res);

      const goodAppeal = JSON.parse(JSON.stringify(EMPTY_APPEAL));
      goodAppeal[sectionName][taskName].uploadedFile = { name: 'some name.jpg' };
      goodAppeal.sectionStates[sectionName][taskName] = 'COMPLETED';

      expect(res.redirect).toHaveBeenCalledWith(`/${VIEW.APPELLANT_SUBMISSION.UPLOAD_DECISION}`);

      expect(createOrUpdateAppeal).toHaveBeenCalledWith(goodAppeal);
    });
  });
});
