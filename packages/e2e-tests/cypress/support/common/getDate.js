import {
  addDays,
  addMonths,
  addYears,
  addWeeks,
  startOfToday,
  subDays,
  subMonths,
  subYears,
  subWeeks,
} from 'date-fns';

export const allowedDatePart = {
  DAY: 'day',
  MONTH: 'month',
  WEEK: 'week',
  YEAR: 'year'
};

export const getFutureDate = (datePart, value, baseDate = startOfToday()) => {
  let futureDate = baseDate;

  switch (datePart) {
    case allowedDatePart.DAY:
      futureDate = addDays(baseDate, value);
      break;
    case allowedDatePart.MONTH:
      futureDate = addMonths(baseDate, value);
      break;
    case allowedDatePart.WEEK:
      futureDate = addWeeks(baseDate, value);
      break;
    case allowedDatePart.YEAR:
      futureDate = addYears(baseDate, value);
      break;
  }

  return futureDate;
}

export const getPastDate = (datePart, value, baseDate = startOfToday()) => {
  let pastDate = baseDate;
  switch (datePart) {
    case allowedDatePart.DAY:
      pastDate = subDays(baseDate, value);
      break;
    case allowedDatePart.MONTH:
      pastDate = subMonths(baseDate, value);
      break;
    case allowedDatePart.WEEK:
      pastDate = subWeeks(baseDate, value);
      break;
    case allowedDatePart.YEAR:
      pastDate = subYears(baseDate, value);
      break;
  }

  return pastDate;
}
