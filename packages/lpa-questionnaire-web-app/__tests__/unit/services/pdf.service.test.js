const { convertToHtml, createPdf } = require('../../../src/services/pdf.service');
const originalMockAppeal = require('../mockAppeal');
const originalMockAppealReply = require('../mockAppealReply');
const { createDocument } = require('../../../src/lib/documents-api-wrapper');

jest.mock('../../../src/lib/documents-api-wrapper');
jest.mock('../../../src/lib/logger', () => ({
  child: () => ({
    debug: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  }),
}));

describe('services/pdf.service', () => {
  let mockAppealReply;
  let mockAppeal;

  beforeEach(() => {
    mockAppealReply = { ...originalMockAppealReply };
    mockAppealReply.submissionDate = Date.parse('2021-07-29T07:35:11.426Z');
    mockAppeal = originalMockAppeal;
  });

  describe('convertToHtml', () => {
    it('should return a html document', () => {
      expect(convertToHtml(mockAppealReply, mockAppeal)).toContain('<!DOCTYPE html>');
    });

    it('should contain text included in the mock reply', () => {
      mockAppealReply.aboutAppealSection.submissionAccuracy.inaccuracyReason =
        'mock-inaccuracy-reason';
      expect(convertToHtml(mockAppealReply, mockAppeal)).toContain('mock-inaccuracy-reason');
    });

    it('should contain submissionDate included in the html document', () => {
      expect(convertToHtml(mockAppealReply, mockAppeal)).toContain(
        'Submitted to the Planning Inspectorate on 29 July 2021'
      );
    });
  });
  describe('createPdf', () => {
    it.skip('should contain text included in the mock reply', async () => {
      createDocument.mockResolvedValueOnce('mock-document');
      const html = convertToHtml(mockAppealReply, mockAppeal);

      const document = await createPdf(mockAppealReply, mockAppeal);

      expect(createDocument).toHaveBeenCalledWith('mock-id', 'mock-pdf', 'lpa-questionnaire.pdf');
      expect(document).toEqual('mock-document');
    });
  });
});
