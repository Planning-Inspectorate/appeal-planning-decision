const { VIEW } = require('../../lib/views');
const { storeTextAsDocument } = require('../../services/pdf.service');
const { documentTypes } = require('@pins/common');

exports.getCheckYourAnswers = async (req, res) => {
	res.render(VIEW.FINAL_COMMENT.CHECK_YOUR_ANSWERS, {
		hasComments: req.session?.finalComment?.hasComments,
		finalComment: req.session?.finalComment
	});
};

exports.postCheckYourAnswers = async (req, res) => {
	const {
		body: { errors = {}, errorSummary = [] }
	} = req;

	if (!req.session.finalComment?.finalCommentAsDocument) {
		req.session.finalComment.finalCommentAsDocument = { uploadedFile: {} };
	} // *Todo* Dev only can remove this once final comments is complete

	const finalComment = req?.session?.finalComment;
	const finalCommentText = req?.session?.finalComment.finalComment;
	const docType = documentTypes.finalComment;
	const { id, name, location, size } = await storeTextAsDocument(
		finalComment,
		finalCommentText,
		docType
	);

	finalComment.finalCommentAsDocument = {
		uploadedFile: {
			id,
			name,
			fileName: name,
			originalFileName: name,
			location,
			size
		}
	};

	if (Object.keys(errors).length > 0) {
		return res.render(VIEW.FINAL_COMMENT.CHECK_YOUR_ANSWERS, {
			errors,
			errorSummary
		});
	}

	res.redirect(`/${VIEW.FINAL_COMMENTS_SUBMITTED}`);
};
