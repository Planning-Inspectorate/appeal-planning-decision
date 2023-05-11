let featureActive = false;
const express = require('express');

(async () => {
	const { isFeatureActive } = require('../../../featureFlag');
	if (await isFeatureActive('final-comments', 'enableForAllLPAs')) {
		featureActive = true;
	}
})();

const finalCommentRouter = require('../../final-comment/final-comment');
const finalCommentSubmittedRouter = require('../../final-comment/final-comment-submitted');
const appealClosedForCommentRouter = require('../../final-comment/appeal-closed-for-comment');
const commentsQuestionRouter = require('../../final-comment/comments-question');
const inputCodeRouter = require('../../final-comment/input-code');
const needNewCodeRouter = require('../../final-comment/need-new-code');
const documentsCheckRouter = require('../../final-comment/documents-check');
const uploadDocumentsRouter = require('../../final-comment/upload-documents');
const checkYourAnswersRouter = require('../../final-comment/check-your-answers');

const router = express.Router();
if (featureActive === true) {
	router.use(finalCommentRouter);
	router.use(finalCommentSubmittedRouter);
	router.use(appealClosedForCommentRouter);
	router.use(commentsQuestionRouter);
	router.use(inputCodeRouter);
	router.use(needNewCodeRouter);
	router.use(documentsCheckRouter);
	router.use(uploadDocumentsRouter);
	router.use(checkYourAnswersRouter);
}
module.exports = router;
