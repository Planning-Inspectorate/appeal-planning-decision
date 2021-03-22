const {
  MIME_TYPE_DOC,
  MIME_TYPE_DOCX,
  MIME_TYPE_PDF,
  MIME_TYPE_JPEG,
  MIME_TYPE_TIF,
  MIME_TYPE_PNG,
  fileSizeDisplayHelper,
  getErrorHtml,
  getSuccessHtml,
} = require('../../../src/lib/file-upload-helpers');

describe('lib/file-upload-helpers', () => {
  describe('file-size-display-helper', () => {
    [
      {
        given: 0,
        expected: '0 Bytes',
      },
      {
        given: 1,
        expected: '1 Bytes',
      },
      {
        given: 1000,
        expected: '1 KB',
      },
      {
        given: 1024,
        expected: '1 KB',
      },
      {
        given: 1024 ** 2,
        expected: '1 MB',
      },
      {
        given: 1000 ** 2,
        expected: '1 MB',
      },
      {
        given: 1024 ** 3,
        expected: '1 GB',
      },
      {
        given: 1000 ** 3,
        expected: '1 GB',
      },
      {
        given: 1024 ** 4,
        expected: '1 TB',
      },
      {
        given: 1000 ** 4,
        expected: '1 TB',
      },
      {
        given: 1024 ** 5,
        expected: '1 PB',
      },
      {
        given: 1000 ** 5,
        expected: '1 PB',
      },
      {
        given: 1024 ** 6,
        expected: '1 EB',
      },
      {
        given: 1000 ** 6,
        expected: '1 EB',
      },
      {
        given: 1024 ** 7,
        expected: '1 ZB',
      },
      {
        given: 1000 ** 7,
        expected: '1 ZB',
      },
      {
        given: 1024 ** 8,
        expected: '1 YB',
      },
      {
        given: 1000 ** 8,
        expected: '1 YB',
      },
      {
        given: 50000000,
        expected: '50 MB',
      },
      {
        given: 52428800,
        expected: '52 MB',
      },
    ].forEach(({ given, expected }) => {
      it(`should display the expected file size - ${expected}`, () => {
        expect(fileSizeDisplayHelper(given)).toBe(expected);
      });
    });
  });

  describe('mime-types', () => {
    it('should define the expected mime types', () => {
      expect(MIME_TYPE_DOC).toBe('application/msword');
      expect(MIME_TYPE_DOCX).toBe(
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      );
      expect(MIME_TYPE_PDF).toBe('application/pdf');
      expect(MIME_TYPE_JPEG).toBe('image/jpeg');
      expect(MIME_TYPE_TIF).toBe('image/tiff');
      expect(MIME_TYPE_PNG).toBe('image/png');
    });
  });

  describe('errorHtml', () => {
    it('should return the correct html', () => {
      expect(getErrorHtml('mock error')).toBe(
        `<span class="moj-multi-file-upload__error">
    <svg class="moj-banner__icon" fill="currentColor" role="presentation" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" height="25" width="25">
      <path d="M13.6,15.4h-2.3v-4.5h2.3V15.4z M13.6,19.8h-2.3v-2.2h2.3V19.8z M0,23.2h25L12.5,2L0,23.2z"/>
    </svg>
    mock error
  </span>`
      );
    });
  });

  describe('successHtml', () => {
    it('should return the correct html', () => {
      expect(getSuccessHtml('mock success')).toBe(
        `<span class="moj-multi-file-upload__success">
      <svg class="moj-banner__icon" fill="currentColor" role="presentation" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" height="25" width="25">
        <path d="M25,6.2L8.7,23.2L0,14.1l4-4.2l4.7,4.9L21,2L25,6.2z"/>
      </svg>
      mock success
    </span>`
      );
    });
  });
});
