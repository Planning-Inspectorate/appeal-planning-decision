const { body } = require('express-validator');
const { isAfter, endOfDay } = require('date-fns');
const dateInputValidation = require('./custom/date-input');
const fileRules = require('./files');

const rules = () => {
  return [
    ...fileRules(),
    body('documents')
      .custom((_, { req }) => !!req.body?.files?.documents?.length)
      .withMessage('Upload a relevant supplementary planning document')
      .bail(),
    body('documentName')
      .notEmpty()
      .withMessage('Enter a name for the supplementary planning document')
      .bail(),
    body('formallyAdopted')
      .notEmpty()
      .withMessage('Select whether this supplementary planning document has been adopted')
      .bail()
      .isIn(['yes', 'no']),
    ...dateInputValidation(
      'adoptedDate',
      'date of adoption',
      body('formallyAdopted').equals('yes')
    ),
    body('adoptedDate').custom((value) => {
      if (!value) return true;

      const today = endOfDay(new Date());

      if (isAfter(new Date(value), today)) {
        throw new Error('Date of adoption must be in the past');
      }

      return true;
    }),
    body('stageReached')
      .if(body('formallyAdopted').equals('no'))
      .notEmpty()
      .withMessage('Tell us what stage the supplementary planning document has reached'),
  ];
};

module.exports = rules;
