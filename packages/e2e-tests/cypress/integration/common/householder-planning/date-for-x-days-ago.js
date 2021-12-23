import moment from 'moment';

export const dateForXDaysAgo = (x) => {
  const now = moment();
  const then = now.subtract(x, 'days');

  return {
    day: then.format('DD'),
    month: then.format('MM'),
    year: then.format('YYYY'),
  };
};
