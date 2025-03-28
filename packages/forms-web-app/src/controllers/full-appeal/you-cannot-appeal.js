const config = require('../../config');
const { VIEW } = require('../../lib/views');

const getYouCannotAppeal = async (req, res) => {
	const clearAppealSessionUrl = '/before-you-start/clear-appeal-session';

	const { appeal } = req.session;
	const { appealDeadline, appealPeriod } = appeal.eligibility;

	return res.render(VIEW.YOU_CANNOT_APPEAL, {
		bannerHtmlOverride: config.betaBannerText,
		appealDeadline,
		appealPeriodToBeDisplayed: appealPeriod,
		clearAppealSessionUrl
	});
};

module.exports = {
	getYouCannotAppeal
};
