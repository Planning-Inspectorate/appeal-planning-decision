const TASK_STATUS = require('./task-statuses');

exports.statusAppealSiteAddress = (appeal) => {
  const { addressLine1, postcode } = appeal.appealSiteSection.siteAddress;
  return addressLine1 && postcode ? TASK_STATUS.COMPLETED : TASK_STATUS.NOT_STARTED;
};
