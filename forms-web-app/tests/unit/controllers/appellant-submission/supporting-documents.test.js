const supportingDocumentsController = require('../../../../src/controllers/appellant-submission/supporting-documents');
const { mockReq, mockRes } = require('../../mocks');
const { VIEW } = require('../../../../src/lib/views');

const req = mockReq();
const res = mockRes();

describe('controller/appellant-submission/supporting-documents', () => {
  describe('getSupportingDocuments', () => {
    it('should call the correct template', () => {
      supportingDocumentsController.getSupportingDocuments(req, res);

      expect(res.render).toHaveBeenCalledWith(VIEW.APPELLANT_SUBMISSION.SUPPORTING_DOCUMENTS);
    });
  });
});
