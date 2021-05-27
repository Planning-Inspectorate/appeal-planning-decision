const { body } = require('express-validator');

const rules = (errorMessage) => {
  return [
    body('booleanInput')
      .custom((value) => {
        // if no error message defined, must be optional question
        if (!errorMessage) return true;

        // checks if manual upload has happened, or if uploadedFiles exist
        return value === 'yes' || value === 'no';
      })
      .withMessage(errorMessage),
  ];
};

module.exports = rules;
