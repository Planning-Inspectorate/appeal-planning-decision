const { checkSchema } = require('express-validator');
const { rules } = require('../../../../src/validators/common/file-upload');
const fileUploadSchema = require('../../../../src/validators/common/schemas/file-upload');

jest.mock('express-validator');

describe('validators/common/file-upload', () => {
  describe('rules', () => {
    it('should call checkSchema with the correct schema', () => {
      rules();

      expect(checkSchema).toHaveBeenCalledWith(fileUploadSchema);
    });
  });
});
