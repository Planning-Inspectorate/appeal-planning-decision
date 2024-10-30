const { VIEW } = require('../../lib/views');
const config = require('../../config');

exports.getAppealStatement = (req, res) => {
	res.render(VIEW.ELIGIBILITY.APPEAL_STATEMENT, { bannerHtmlOverride: config.betaBannerText });
};

exports.postAppealStatement = (req, res) => {
	res.redirect(`/${VIEW.APPELLANT_SUBMISSION.TASK_LIST}`);
};
