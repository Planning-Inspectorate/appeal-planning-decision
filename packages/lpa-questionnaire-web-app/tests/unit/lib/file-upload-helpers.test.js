const {
  MIME_TYPE_DOC,
  MIME_TYPE_DOCX,
  MIME_TYPE_PDF,
  MIME_TYPE_JPEG,
  MIME_TYPE_TIF,
  MIME_TYPE_PNG,
  fileSizeDisplayHelper,
  deleteFile,
  addFilesToSession,
  fileErrorSummary,
  fileUploadNunjucksVariables,
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

  describe('deleteFile', () => {
    let req;

    beforeEach(() => {
      req = {
        session: {
          uploadedFiles: [{ name: 'mock-file' }],
        },
      };
    });

    it('should return if no name', () => {
      deleteFile(undefined, req);

      expect(req).toEqual({
        session: {
          uploadedFiles: [{ name: 'mock-file' }],
        },
      });
    });

    it('should throw an error if file not found', () => {
      expect(() => deleteFile('another-file', req)).toThrowError();
    });

    it('should delete a file if found', () => {
      deleteFile('mock-file', req);

      expect(req).toEqual({
        session: {
          uploadedFiles: [],
        },
      });
    });
  });

  describe('addFilesToSession', () => {
    let req;

    beforeEach(() => {
      req = {
        body: {},
        session: {
          uploadedFiles: [],
        },
      };
    });

    it('should return immediately if no file provided', () => {
      expect(() => addFilesToSession()).not.toThrowError();
    });

    it('should add a file to the uploadedFiles session', () => {
      addFilesToSession([{ file: 'mock-file' }, { file: 'another-file' }], req);

      expect(req.session.uploadedFiles).toEqual([{ file: 'mock-file' }, { file: 'another-file' }]);
    });

    it('should add errors for file from errors in request', () => {
      req.session.uploadedFiles.push({ file: 'existing-file' });
      req.body.errors = { 'files.documents[0]': { msg: 'mock error' } };

      addFilesToSession([{ file: 'mock-file' }, { file: 'another-file' }], req);

      expect(req.session.uploadedFiles).toEqual([
        { file: 'existing-file' },
        { file: 'mock-file', error: 'mock error' },
        { file: 'another-file' },
      ]);
    });
  });

  describe('errorFileSummary', () => {
    let req;

    beforeEach(() => {
      req = {
        session: {
          uploadedFiles: [{ name: 'mock-file', error: 'some error' }],
        },
      };
    });

    it('outputs the expected file summary', () => {
      expect(fileErrorSummary(undefined, req)).toEqual([
        {
          href: '#mock-file',
          text: 'some error',
        },
      ]);

      expect(fileErrorSummary('mock-input-error', req)).toEqual([
        {
          href: '#documents',
          text: 'mock-input-error',
        },
        {
          href: '#mock-file',
          text: 'some error',
        },
      ]);
    });
  });

  describe('fileUploadNunjucksVariables', () => {
    it('outputs the expected variables', () => {
      const req = {
        session: {
          uploadedFiles: [{ name: 'mock-file', error: 'some error' }, { name: 'another-file' }],
        },
      };

      const errorSummary = fileErrorSummary('mock-input-error', req);
      expect(
        fileUploadNunjucksVariables('mock-input-error', errorSummary, req.session.uploadedFiles)
      ).toEqual({
        errorMessage: 'mock-input-error',
        errorSummary: [
          {
            href: '#documents',
            text: 'mock-input-error',
          },
          {
            href: '#mock-file',
            text: 'some error',
          },
        ],
        uploadedFiles: [
          {
            deleteButton: {
              text: 'Delete',
            },
            fileName: 'mock-file',
            originalFileName: 'mock-file',
            message: {
              html: `<span class="moj-multi-file-upload__error">
      <svg class="moj-banner__icon" fill="currentColor" role="presentation" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" height="25" width="25">
        <path d="M13.6,15.4h-2.3v-4.5h2.3V15.4z M13.6,19.8h-2.3v-2.2h2.3V19.8z M0,23.2h25L12.5,2L0,23.2z"/>
      </svg>
      some error
    </span>`,
            },
          },
          {
            deleteButton: {
              text: 'Delete',
            },
            fileName: 'another-file',
            originalFileName: 'another-file',
            message: {
              html: `<span class="moj-multi-file-upload__success">
      <svg class="moj-banner__icon" fill="currentColor" role="presentation" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" height="25" width="25">
        <path d="M25,6.2L8.7,23.2L0,14.1l4-4.2l4.7,4.9L21,2L25,6.2z"/>
      </svg>
      another-file
    </span>`,
            },
          },
        ],
      });
    });
  });
});
