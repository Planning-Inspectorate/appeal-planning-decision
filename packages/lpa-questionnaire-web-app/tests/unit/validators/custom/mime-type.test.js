const validateMimeType = require('../../../../src/validators/custom/mime-type');

describe('validators/custom/mime-type', () => {
  it('should be valid', () => {
    const mimes = ['a', 'b', 'c'];

    mimes.forEach((mime) => expect(validateMimeType(mime, mimes)).toBeTruthy());
  });

  [
    {
      givenMimeType: 'x',
      allowableMimeTypes: ['y'],
      errorMessage: 'Doc is the wrong file type: The file must be a Something, or Something',
    },
    {
      givenMimeType: 'x',
      allowableMimeTypes: ['y', 'z'],
      errorMessage: 'Doc is the wrong file type: The file must be a Something, or Something',
    },
    {
      givenMimeType: 'x',
      allowableMimeTypes: ['y', 'z', 'qqq'],
      errorMessage: 'Can be anything - exact words are not important',
    },
  ].forEach(({ givenMimeType, allowableMimeTypes, errorMessage }) => {
    it('should throw', () => {
      expect(() => validateMimeType(givenMimeType, allowableMimeTypes, errorMessage)).toThrow(
        errorMessage
      );
    });
  });
});
