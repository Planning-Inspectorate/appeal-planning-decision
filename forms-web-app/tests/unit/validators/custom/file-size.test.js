const validateFileSize = require('../../../../src/validators/custom/file-size');

describe('validators/custom/file-size', () => {
  it('should be valid when given a smaller file size than the configured maximum', () => {
    expect(validateFileSize(1024, 2048)).toBeTruthy();
  });

  it('should be valid when given a file size that matches the configured maximum', () => {
    expect(validateFileSize(1024, 1024)).toBeTruthy();
  });

  [
    {
      givenFileSize: 1,
      maxFileSize: 0,
      expectedErrorMessage: 'The file must be smaller than 0 Bytes',
    },
    {
      givenFileSize: 2,
      maxFileSize: 1,
      expectedErrorMessage: 'The file must be smaller than 1 Bytes',
    },
    {
      givenFileSize: 2048,
      maxFileSize: 1024,
      expectedErrorMessage: 'The file must be smaller than 1 KB',
    },
    {
      givenFileSize: 1024 ** 2 + 1,
      maxFileSize: 1024 ** 2,
      expectedErrorMessage: 'The file must be smaller than 1 MB',
    },
    {
      givenFileSize: 1024 ** 3 + 1,
      maxFileSize: 1024 ** 3,
      expectedErrorMessage: 'The file must be smaller than 1 GB',
    },
    {
      givenFileSize: 1024 ** 4 + 1,
      maxFileSize: 1024 ** 4,
      expectedErrorMessage: 'The file must be smaller than 1 TB',
    },
    {
      givenFileSize: 1024 ** 5 + 1,
      maxFileSize: 1024 ** 5,
      expectedErrorMessage: 'The file must be smaller than 1 PB',
    },
    {
      givenFileSize: 1024 ** 7,
      maxFileSize: 1024 ** 6,
      expectedErrorMessage: 'The file must be smaller than 1 EB',
    },
    {
      givenFileSize: 1024 ** 8,
      maxFileSize: 1024 ** 7,
      expectedErrorMessage: 'The file must be smaller than 1 ZB',
    },
    {
      givenFileSize: 1024 ** 9,
      maxFileSize: 1024 ** 8,
      expectedErrorMessage: 'The file must be smaller than 1 YB',
    },
  ].forEach(({ givenFileSize, maxFileSize, expectedErrorMessage }) => {
    it(`should throw when oversize - ${expectedErrorMessage}`, () => {
      expect(() => validateFileSize(givenFileSize, maxFileSize)).toThrow(expectedErrorMessage);
    });
  });
});
