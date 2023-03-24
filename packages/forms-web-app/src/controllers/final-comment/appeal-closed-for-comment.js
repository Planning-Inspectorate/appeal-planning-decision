const { VIEW } = require('../../lib/views');

exports.getAppealClosedForComment = async (req, res) => {
	res.render(VIEW.FINAL_COMMENT.APPEAL_CLOSED_FOR_COMMENT);
};
