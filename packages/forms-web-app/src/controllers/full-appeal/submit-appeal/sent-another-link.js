const {
	VIEW: {
		FULL_APPEAL: { SENT_ANOTHER_LINK: currentPage }
	}
} = require('../../../lib/full-appeal/views');

const getSentAnotherLink = (req, res) => {
	res.render(currentPage, {});
};

module.exports = {
	getSentAnotherLink
};
