const TASK_STATUS = require('./task-statuses');

exports.statusSiteOwnership = (appeal) => {
	const { ownsWholeSite, haveOtherOwnersBeenTold } = appeal.appealSiteSection.siteOwnership;

	if (ownsWholeSite === null) {
		return TASK_STATUS.NOT_STARTED;
	}

	if (ownsWholeSite) {
		return TASK_STATUS.COMPLETED;
	}

	if (haveOtherOwnersBeenTold === null) {
		return TASK_STATUS.IN_PROGRESS;
	}

	return TASK_STATUS.COMPLETED;
};
