const {
  MIME_TYPE_DOC,
  MIME_BINARY_TYPE_DOC,
  MIME_TYPE_DOCX,
  MIME_TYPE_PDF,
  MIME_TYPE_JPEG,
  MIME_TYPE_TIF,
  MIME_TYPE_PNG,
} = require('../../../src/lib/mime-types');

describe('lib/mime-types', () => {
  it('should define the expected mime types', () => {
    expect(MIME_TYPE_DOC).toBe('application/msword');
    expect(MIME_BINARY_TYPE_DOC).toBe('application/x-cfb');
    expect(MIME_TYPE_DOCX).toBe(
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    expect(MIME_TYPE_PDF).toBe('application/pdf');
    expect(MIME_TYPE_JPEG).toBe('image/jpeg');
    expect(MIME_TYPE_TIF).toBe('image/tiff');
    expect(MIME_TYPE_PNG).toBe('image/png');
  });
});
