const { body } = require('express-validator');
const fileRules = require('./files');

const rules = (errorMessage) => {
  return [
    ...fileRules(),
    body('documents')
      .custom((_, { req }) => {
        // checks if manual upload has happened, or if uploadedFiles exist
        return !!req.body?.files?.documents?.length || !!req.session?.uploadedFiles?.length;
      })
      .withMessage(errorMessage),
  ];
};

module.exports = rules;
