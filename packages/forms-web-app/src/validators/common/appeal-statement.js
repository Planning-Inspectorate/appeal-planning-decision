const { body, checkSchema } = require('express-validator');
const fileUploadSchema = require('./schemas/file-upload');

const rules = (noFilesError) => {
  return [
    checkSchema(fileUploadSchema(noFilesError)),

    body('does-not-include-sensitive-information')
      .notEmpty()
      .withMessage('Select to confirm you have not included sensitive information')
      .bail()
      .equals('i-confirm'),
  ];
};

module.exports = {
  rules,
};
