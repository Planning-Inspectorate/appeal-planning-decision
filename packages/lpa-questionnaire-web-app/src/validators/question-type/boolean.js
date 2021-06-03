const { body } = require('express-validator');

const rules = (errorMessage, textConfig) => {
  return [
    body('booleanInput')
      .custom((value) => {
        // if no error message defined, must be optional question
        if (!errorMessage) return true;

        // checks if manual upload has happened, or if uploadedFiles exist
        return value === 'yes' || value === 'no';
      })
      .withMessage(errorMessage),
    body('booleanInputText')
      .custom((value, { req }) => {
        // if text config not passed, has no text field, or if value is present
        if (!textConfig || value) return true;

        // check value of booleanInput
        const { booleanInput = '' } = req.body;
        if (['yes', 'no'].includes(booleanInput)) {
          const booleanValue = booleanInput === 'yes';
          return booleanValue !== textConfig.parentValue;
        }

        return true;
      })
      .withMessage(textConfig?.emptyError),
  ];
};

module.exports = rules;
