const { VIEW } = require('../../lib/views');

const getOutOfTimeShutterPage = async (req, res) => {
	const { appeal } = req.session;
	const { appealDeadline, appealPeriod } = appeal.eligibility;

	let appealPeriodToBeDisplayed;

	if (appealPeriod === '181 days') {
		appealPeriodToBeDisplayed = '6 months';
	} else if (appealPeriod === '83 days') {
		appealPeriodToBeDisplayed = '12 weeks';
	} else {
		appealPeriodToBeDisplayed = appealPeriod;
	}

	return res.render(VIEW.OUT_OF_TIME_SHUTTER_PAGE, {
		appealDeadline,
		appealPeriodToBeDisplayed
	});
};

module.exports = {
	getOutOfTimeShutterPage
};
