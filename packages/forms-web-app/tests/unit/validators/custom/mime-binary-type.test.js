const validateMimeBinaryType = require('../../../../src/validators/custom/mime-binary-type');

describe('validators/custom/mime-type', () => {
  it('should be valid', () => {
    const mimes = ['a', 'b', 'c'];

    mimes.forEach((mime) => expect(validateMimeBinaryType(mime, mimes)).toBeTruthy());
  });

  [
    // {
    //   fileInformation: { tempFilePath: 'a' },
    //   allowableMimeTypes: ['y'],
    //   errorMessage: 'Doc is the wrong file type: The file must be a Something, or Something',
    // },
  ].forEach(({ fileInformation, allowableMimeTypes, errorMessage }) => {
    it('should throw', () => {
      expect(() =>
        validateMimeBinaryType(fileInformation, allowableMimeTypes, errorMessage)
      ).toThrow(errorMessage);
    });
  });
});
