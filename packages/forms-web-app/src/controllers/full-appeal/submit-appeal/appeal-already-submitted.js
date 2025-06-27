const {
	VIEW: {
		FULL_APPEAL: { APPEAL_ALREADY_SUBMITTED: currentPage }
	}
} = require('../../../lib/full-appeal/views');

const getAppealAlreadySubmitted = (req, res) => {
	res.render(currentPage, {});
};

module.exports = {
	getAppealAlreadySubmitted
};
