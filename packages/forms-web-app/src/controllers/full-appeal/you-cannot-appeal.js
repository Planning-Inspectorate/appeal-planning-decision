const { VIEW } = require('../../lib/views');

const getYouCannotAppeal = async (req, res) => {
	const beforeYouStartFirstPage = '/before-you-start';

	const { appeal } = req.session;
	const { appealDeadline, appealPeriod } = appeal.eligibility;

	// Clear appeal object
	req.session.appeal = null;

	return res.render(VIEW.YOU_CANNOT_APPEAL, {
		appealDeadline,
		appealPeriodToBeDisplayed: appealPeriod,
		beforeYouStartFirstPage
	});
};

module.exports = {
	getYouCannotAppeal
};
