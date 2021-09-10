const TASK_STATUS = require('./task-statuses');

exports.statusYourDetails = (appeal) => {
  const { isOriginalApplicant, name, email, appealingOnBehalfOf } =
    appeal.aboutYouSection.yourDetails;

  const isStarted = isOriginalApplicant !== null || name || email || appealingOnBehalfOf;

  if (!isStarted) {
    return TASK_STATUS.NOT_STARTED;
  }

  return (isOriginalApplicant || appealingOnBehalfOf) && name
    ? TASK_STATUS.COMPLETED
    : TASK_STATUS.IN_PROGRESS;
};
