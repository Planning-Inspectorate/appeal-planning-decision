const { VIEW } = require('../../lib/views');
const { storeTextAsDocument } = require('../../services/pdf.service');
const { documentTypes } = require('@pins/common');
const { submitFinalComment } = require('../../lib/appeals-api-wrapper');
const logger = require('../../lib/logger');

exports.getCheckYourAnswers = async (req, res) => {
	res.render(VIEW.FINAL_COMMENT.CHECK_YOUR_ANSWERS, {
		finalComment: req.session.finalComment
	});
};

exports.postCheckYourAnswers = async (req, res) => {
	const {
		body: { errors = {}, errorSummary = [] }
	} = req;

	const log = logger.child({});

	const finalComment = req.session.finalComment;
	const finalCommentText = req.session.finalComment.finalComment;
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

	try {
		await submitFinalComment(finalComment);
	} catch (err) {
		log.error({ err }, 'final comment submission failed');
		res.render(VIEW.FINAL_COMMENT.CHECK_YOUR_ANSWERS, {
			errors,
			errorSummary: [{ text: err.toString(), href: '#' }]
		});
	}

	res.redirect(`/${VIEW.FINAL_COMMENT.FINAL_COMMENT_SUBMITTED}`);
};
