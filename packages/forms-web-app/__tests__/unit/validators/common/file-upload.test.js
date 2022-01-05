const { checkSchema } = require('express-validator');
const { rules } = require('../../../../src/validators/common/file-upload');
const fileUploadSchema = require('../../../../src/validators/common/schemas/file-upload');

jest.mock('express-validator');
jest.mock('../../../../src/validators/common/schemas/file-upload');

describe('validators/common/file-upload', () => {
  describe('rules', () => {
    it('should call checkSchema with the correct schema when noFilesError is not given', () => {
      rules();

      expect(checkSchema).toHaveBeenCalledWith(fileUploadSchema());
      expect(fileUploadSchema).toHaveBeenCalledWith();
    });

    it('should call checkSchema with the correct schema when noFilesError is given', () => {
      const noFilesError = 'Select your planning application form';

      rules(noFilesError);

      expect(checkSchema).toHaveBeenCalledWith(fileUploadSchema(noFilesError));
      expect(fileUploadSchema).toHaveBeenCalledWith(noFilesError);
    });
  });
});
