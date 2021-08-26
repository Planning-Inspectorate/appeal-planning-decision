const {
  addBusinessDays,
  parseISO,
  isWithinInterval,
  getYear,
  endOfDay,
  isValid: isDateValid,
} = require('date-fns');
const Holidays = require('date-holidays');
const { appeal: appealConfig } = require('../../config');
const isValid = require('../../validation/appeal/type/is-valid');
const { APPEAL_ID } = require('../../constants');

const checkIfDateValid = (startDate) => {
  if (!isDateValid(startDate)) {
    throw new Error('The given date must be a valid Date instance');
  }
};

const checkIfAppealTypeValid = (appealType) => {
  if (!isValid(appealType)) {
    throw new Error(`${appealType} is not a valid appeal type`);
  }
};

const calculateEndDate = (startDate, appealType, additionalDays) => {
  const unitOfTime = appealConfig.type[appealType].questionnaireDue.duration;
  const amountOfTime = appealConfig.type[appealType].questionnaireDue.time;
  return addBusinessDays(endOfDay(startDate), { [unitOfTime]: amountOfTime }.days + additionalDays);
};

const calculateNumHolidays = (startDate, endDate) => {
  const holidays = new Holidays('GB', 'ENG').getHolidays(getYear(startDate));

  return holidays.filter((holiday) =>
    isWithinInterval(parseISO(holiday.date), {
      start: startDate,
      end: endDate,
    }),
  ).length;
};

const calculateDueDate = (startDate, appealType) => {
  const endDate = calculateEndDate(startDate, appealType, 0);
  const numHolidays = calculateNumHolidays(startDate, endDate);
  return calculateEndDate(startDate, appealType, numHolidays);
};

/**
 * @description Given an appeal object, return the due date for the Questionnaire.
 *
 * @param appeal the appeal object
 * @param {Number} expiryPeriodInDays a positive number
 * @returns {Date}
 *
 * @throws {Error}
 */
module.exports = (appeal, appealType = APPEAL_ID.HOUSEHOLDER) => {
  // TODO change submissionDate when startDate is implemented
  const startDate = appeal.submissionDate;
  checkIfDateValid(startDate);
  checkIfAppealTypeValid(appealType);
  return calculateDueDate(startDate, appealType);
};
