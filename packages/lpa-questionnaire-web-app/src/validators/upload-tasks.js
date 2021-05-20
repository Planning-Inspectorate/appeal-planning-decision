const { body } = require('express-validator');
const fileRules = require('./files');

const rules = (errorMessage) => {
  return [
    ...fileRules(),
    body('documents')
      .custom((_, { req }) => {
        // if no error message defined, must be optional question
        if (!errorMessage) return true;

        // checks if manual upload has happened, or if uploadedFiles exist
        return !!req.body?.files?.documents?.length || !!req.body?.tempDocs;
      })
      .withMessage(errorMessage),
  ];
};

module.exports = rules;
