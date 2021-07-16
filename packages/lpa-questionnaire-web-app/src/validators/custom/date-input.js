const { body } = require('express-validator');
const { isLeapYear } = require('date-fns');
const { capitalize } = require('../../lib/string-functions');

/**
 * Generic validator that validates date input as per https://design-system.service.gov.uk/components/date-input/
 *
 * @param inputRef - ID of input passed to date component
 * @param res - Label used by error messages so user understands data required (e.g Date of Birth)
 * @returns {Array}
 */

module.exports = (inputRef, inputLabel, condition = () => true) => {
  const dayInput = `${inputRef}-day`;
  const monthInput = `${inputRef}-month`;
  const yearInput = `${inputRef}-year`;

  return [
    body(dayInput)
      .if(condition)
      .notEmpty()
      .withMessage((_, { req }) => {
        if (!req.body[monthInput] && !req.body[yearInput]) {
          return `Tell us the date the supplementary planning document was adopted`;
        }

        if (!req.body[monthInput] && req.body[yearInput]) {
          return `${capitalize(inputLabel)} must include a day and month`;
        }

        if (req.body[monthInput] && !req.body[yearInput]) {
          return `${capitalize(inputLabel)} must include a day and year`;
        }

        return `${capitalize(inputLabel)} must include a day`;
      }),

    body(monthInput)
      .if(condition)
      .notEmpty()
      .withMessage((_, { req }) => {
        if (!req.body[yearInput]) {
          return `${capitalize(inputLabel)} must include a month and year`;
        }

        return `${capitalize(inputLabel)} must include a month`;
      }),

    body(yearInput)
      .if(condition)
      .notEmpty()
      .withMessage(`${capitalize(inputLabel)} must include a year`),

    body(dayInput)
      .if(condition)
      .isInt({ min: 1, max: 31 })
      .withMessage(`${capitalize(inputLabel)} must be a real date`)
      .bail()
      .toInt()
      .custom((value, { req }) => {
        const monthNum = parseInt(req.body[monthInput], 10);
        if (value === 31 && monthNum && [4, 6, 9, 11].includes(monthNum)) return false;

        if (value > 28 && monthNum && monthNum === 2) {
          const yearNum = parseInt(req.body[yearInput], 10);
          return yearNum && isLeapYear(new Date(yearNum, 1, 1)) && value === 29;
        }

        return true;
      })
      .withMessage(`${capitalize(inputLabel)} must be a real date`),

    body(monthInput)
      .if(condition)
      .isInt({ min: 1, max: 12 })
      .withMessage(`${capitalize(inputLabel)} must be a real date`),

    body(yearInput)
      .if(condition)
      .isInt({ min: 1000, max: 9999 })
      .withMessage(`${capitalize(inputLabel)} must be a real date`),
  ];
};
