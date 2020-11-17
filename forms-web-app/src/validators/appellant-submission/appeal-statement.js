const path = require('path');
const { body } = require('express-validator');

const acceptedFormats = ['.pdf', '.doc', '.docx', '.tif', '.tiff', '.jpg', '.jpeg', '.png'];

const rules = () => {
  function validateUploadedFile(filename) {
    const extension = path.extname(filename).toLowerCase();

    if (!acceptedFormats.includes(extension)) {
      throw new Error('The selected file must be a PDF, Microsoft Word, TIF, JPEG or PNG');
    }

    return filename;
  }

  return [
    body('privacy-safe')
      .equals('true')
      .withMessage('You cannot provide a statement that includes sensitive information'),

    body('appeal-statement-file-upload')
      .notEmpty()
      .withMessage('Select an appeal statement')
      .bail()
      .custom((value) => validateUploadedFile(value)),
  ];
};

module.exports = {
  rules,
};
