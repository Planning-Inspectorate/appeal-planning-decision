const { convertToHtml } = require('../../../src/services/pdf.service');
const { mockReq: genMockReq } = require('../mocks');
const blankAppeal = require('../mockAppeal');
const blankAppealReply = require('../emptyAppealReply');

describe('services/pdf.service', () => {
  let mockReq = {};
  let mockAppealReply;
  let mockAppeal;

  beforeEach(() => {
    mockAppealReply = { ...blankAppealReply };
    mockReq = genMockReq();
    mockAppeal = blankAppeal;
  });

  describe('convertToHtml', () => {
    it('should return a html document', () => {
      expect(convertToHtml(mockReq, mockAppeal)).toContain('<!DOCTYPE html>');
    });

    it('should contain text included in the mock reply', () => {
      const mockTestString = 'mock-inaccuracy-reason';
      mockAppealReply.aboutAppealSection.submissionAccuracy.inaccuracyReason = mockTestString;
      mockReq = genMockReq(mockAppealReply);
      expect(convertToHtml(mockReq, mockAppeal)).toContain(mockTestString);
    });
  });
});
