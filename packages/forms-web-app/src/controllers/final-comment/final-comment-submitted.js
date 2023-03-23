const { VIEW } = require('../../lib/views');

exports.getFinalCommentSubmitted = async (req, res) => {
	res.render(VIEW.FINAL_COMMENT.FINAL_COMMENT_SUBMITTED, {
		horizonId: req.session.finalComment.horizonId
	});
};
