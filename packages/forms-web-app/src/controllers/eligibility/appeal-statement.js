const { VIEW } = require('../../lib/views');

exports.getAppealStatement = (req, res) => {
	res.render(VIEW.ELIGIBILITY.APPEAL_STATEMENT);
};

exports.postAppealStatement = (req, res) => {
	res.redirect(`/${VIEW.APPELLANT_SUBMISSION.TASK_LIST}`);
};
