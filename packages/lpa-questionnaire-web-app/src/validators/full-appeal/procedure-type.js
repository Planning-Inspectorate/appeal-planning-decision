const { body } = require('express-validator');

const validProcedureTypeOptions = ['written-representations', 'hearing', 'inquiry'];

const rules = () => {
  return [
    body('procedure-type')
      .notEmpty()
      .withMessage('Select the procedure that you think is most appropriate for this appeal')
      .bail()
      .isIn(validProcedureTypeOptions),

    body('inquiry-days').custom((value, { req }) => {
      if (req.body['procedure-type'] === 'inquiry') {
        if (value === '' || Number(value) % 1 !== 0) {
          throw new Error(
            'The number of days you would expect the inquiry to last must be a number, such as 5.'
          );
        }

        if (Number(value) < 1) {
          throw new Error(
            'The number of days you would expect the inquiry to last must be 1 or more.'
          );
        }

        /* istanbul ignore next */
        if (Number(value) > 999) {
          throw new Error(
            'The number of days you would expect the inquiry to last must be fewer than 999.'
          );
        }
      }

      return true;
    }),
  ];
};

module.exports = {
  rules,
  validProcedureTypeOptions,
};
