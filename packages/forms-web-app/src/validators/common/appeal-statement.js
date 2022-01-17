const { body, checkSchema } = require('express-validator');
const fileUploadSchema = require('./schemas/file-upload');

const rules = (noFilesError) => {
  return [
    checkSchema(fileUploadSchema(noFilesError)),

    body('does-not-include-sensitive-information')
      .notEmpty()
      .withMessage(
        'Select to confirm that you have not included any sensitive information in your appeal statement'
      )
      .bail()
      .equals('i-confirm'),
  ];
};

module.exports = {
  rules,
};
