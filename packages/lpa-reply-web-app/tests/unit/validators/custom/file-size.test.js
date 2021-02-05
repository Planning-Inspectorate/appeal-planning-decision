const validateFileSize = require('../../../../src/validators/custom/file-size');

describe('validators/custom/file-size', () => {
  it('should be valid when given a smaller file size than the configured maximum', () => {
    expect(validateFileSize(1024, 2048)).toBeTruthy();
  });

  it('should be valid when given a file size that matches the configured maximum', () => {
    expect(validateFileSize(1024, 1024)).toBeTruthy();
  });

  describe('should throw when oversize', () => {
    const testSetup = () => [
      {
        givenFileSize: 1,
        maxFileSize: 0,
        expectedErrorMessage: (filename) => `${filename} must be smaller than 0 Bytes`,
      },
      {
        givenFileSize: 2,
        maxFileSize: 1,
        expectedErrorMessage: (filename) => `${filename} must be smaller than 1 Bytes`,
      },
      {
        givenFileSize: 2048,
        maxFileSize: 1024,
        expectedErrorMessage: (filename) => `${filename} must be smaller than 1 KB`,
      },
      {
        givenFileSize: 1024 ** 2 + 1,
        maxFileSize: 1024 ** 2,
        expectedErrorMessage: (filename) => `${filename} must be smaller than 1 MB`,
      },
      {
        givenFileSize: 1024 ** 3 + 1,
        maxFileSize: 1024 ** 3,
        expectedErrorMessage: (filename) => `${filename} must be smaller than 1 GB`,
      },
      {
        givenFileSize: 1024 ** 4 + 1,
        maxFileSize: 1024 ** 4,
        expectedErrorMessage: (filename) => `${filename} must be smaller than 1 TB`,
      },
      {
        givenFileSize: 1024 ** 5 + 1,
        maxFileSize: 1024 ** 5,
        expectedErrorMessage: (filename) => `${filename} must be smaller than 1 PB`,
      },
      {
        givenFileSize: 1024 ** 7,
        maxFileSize: 1024 ** 6,
        expectedErrorMessage: (filename) => `${filename} must be smaller than 1 EB`,
      },
      {
        givenFileSize: 1024 ** 8,
        maxFileSize: 1024 ** 7,
        expectedErrorMessage: (filename) => `${filename} must be smaller than 1 ZB`,
      },
      {
        givenFileSize: 1024 ** 9,
        maxFileSize: 1024 ** 8,
        expectedErrorMessage: (filename) => `${filename} must be smaller than 1 YB`,
      },
    ];

    testSetup().forEach(({ givenFileSize, maxFileSize, expectedErrorMessage }) => {
      it(`generic file name - ${givenFileSize}`, () => {
        expect(() => validateFileSize(givenFileSize, maxFileSize)).toThrow(
          expectedErrorMessage('The file')
        );
      });
    });

    testSetup().forEach(({ givenFileSize, maxFileSize, expectedErrorMessage }) => {
      it(`specific file name - ${givenFileSize}`, () => {
        const fileName = 'Some file name.png';
        expect(() => validateFileSize(givenFileSize, maxFileSize, fileName)).toThrow(
          expectedErrorMessage(fileName)
        );
      });
    });
  });
});
