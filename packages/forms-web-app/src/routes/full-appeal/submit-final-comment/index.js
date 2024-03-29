const express = require('express');
const { featureFlagMiddleware } = require('../../../middleware/feature-flag');
const { FLAG } = require('@pins/common/src/feature-flags');
const checkFinalCommentDeadline = require('../../../middleware/final-comment/check-final-comment-deadline');

const router = express.Router();

const finalCommentRouter = require('../../final-comment/final-comment');
const finalCommentSubmittedRouter = require('../../final-comment/final-comment-submitted');
const appealClosedForCommentRouter = require('../../final-comment/appeal-closed-for-comment');
const commentsQuestionRouter = require('../../final-comment/comments-question');
const inputCodeRouter = require('../../final-comment/input-code');
const codeExpiredRouter = require('../../final-comment/code-expired');
const needNewCodeRouter = require('../../final-comment/need-new-code');
const documentsCheckRouter = require('../../final-comment/documents-check');
const uploadDocumentsRouter = require('../../final-comment/upload-documents');
const checkYourAnswersRouter = require('../../final-comment/check-your-answers');

router.use(featureFlagMiddleware(FLAG.FINAL_COMMENTS, 'enableForAllLPAs'));

router.use(inputCodeRouter);
router.use(codeExpiredRouter);
router.use(needNewCodeRouter);
router.use(appealClosedForCommentRouter);

router.use(checkFinalCommentDeadline);
router.use(finalCommentRouter);
router.use(finalCommentSubmittedRouter);
router.use(commentsQuestionRouter);
router.use(documentsCheckRouter);
router.use(uploadDocumentsRouter);
router.use(checkYourAnswersRouter);

module.exports = router;
