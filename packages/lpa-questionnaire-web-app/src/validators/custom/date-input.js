const { body } = require('express-validator');
const { isLeapYear } = require('date-fns');
const { capitalize } = require('../../lib/string-functions');

function getDateObject(inputRef) {
  return {
    d: `${inputRef}-day`,
    m: `${inputRef}-month`,
    y: `${inputRef}-year`,
  };
}

function dateNumValid(dateNum, min, max) {
  if (dateNum === '') return true;
  const parsedDateNum = parseInt(dateNum, 10);
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(parsedDateNum)) return false;
  return (parsedDateNum - min) * (parsedDateNum - max) <= 0;
}

function isLongMonthDay(day, month) {
  return !(day === '31' && ['4', '6', '9', '11'].includes(month));
}

function isLeapYearDay(day, month, year) {
  if (day > 28 && month && month === 2) {
    return year && isLeapYear(new Date(year, 1, 1)) && day === 29;
  }
  return true;
}

function createValidationErrors(date, req, inputLabel) {
  if (
    !dateNumValid(req.body[date.d], 1, 31) ||
    !dateNumValid(req.body[date.m], 1, 12) ||
    !dateNumValid(req.body[date.y], 1900, 2100) ||
    !isLongMonthDay(req.body[date.d], req.body[date.m]) ||
    !isLeapYearDay(
      parseInt(req.body[date.d], 10),
      parseInt(req.body[date.m], 10),
      parseInt(req.body[date.y], 10)
    )
  ) {
    return `${capitalize(inputLabel)} must be a real date`;
  }
  if (!req.body[date.d] && !req.body[date.m] && !req.body[date.y]) {
    return `Tell us the date the supplementary planning document was adopted`;
  }
  if (!req.body[date.d] && req.body[date.m] && req.body[date.y]) {
    return `${capitalize(inputLabel)} must include a day`;
  }
  if (req.body[date.d] && !req.body[date.m] && req.body[date.y]) {
    return `${capitalize(inputLabel)} must include a month`;
  }
  if (req.body[date.d] && req.body[date.m] && !req.body[date.y]) {
    return `${capitalize(inputLabel)} must include a year`;
  }
  if (!req.body[date.d] && !req.body[date.m] && req.body[date.y]) {
    return `${capitalize(inputLabel)} must include a day and month`;
  }
  if (!req.body[date.d] && req.body[date.m] && !req.body[date.y]) {
    return `${capitalize(inputLabel)} must include a day and year`;
  }
  if (req.body[date.d] && !req.body[date.m] && !req.body[date.y]) {
    return `${capitalize(inputLabel)} must include a month and year`;
  }
  return '';
}

/**
 * Generic validator that validates date input as per https://design-system.service.gov.uk/components/date-input/
 *
 * @param inputRef - ID of input passed to date component
 * @param inputLabel - Label used by error messages so user understands data required (e.g Date of Birth)
 * @returns {Array}
 */

// function skipped as req is passed implicitly and impossible / very difficult to mock
/* istanbul ignore next */
function defaultExport(inputRef, inputLabel = () => true) {
  return [
    body(getDateObject(inputRef))
      .notEmpty()
      .withMessage((_, { req }) => {
        return createValidationErrors(getDateObject(inputRef), req, inputLabel);
      }),
  ];
}

module.exports = defaultExport;
exports = module.exports;
exports.createValidationErrors = createValidationErrors;
