const express = require('express');
const featureFlagMiddleware = require('../../../middleware/feature-flag');

const router = express.Router();

const finalCommentRouter = require('../../final-comment/final-comment');
const finalCommentSubmittedRouter = require('../../final-comment/final-comment-submitted');
const appealClosedForCommentRouter = require('../../final-comment/appeal-closed-for-comment');
const commentsQuestionRouter = require('../../final-comment/comments-question');
const inputCodeRouter = require('../../final-comment/input-code');
const needNewCodeRouter = require('../../final-comment/need-new-code');
const documentsCheckRouter = require('../../final-comment/documents-check');
const uploadDocumentsRouter = require('../../final-comment/upload-documents');
const checkYourAnswersRouter = require('../../final-comment/check-your-answers');

router.use(featureFlagMiddleware('final-comments', 'enableForAllLPAs'));
router.use(finalCommentRouter);
router.use(finalCommentSubmittedRouter);
router.use(appealClosedForCommentRouter);
router.use(commentsQuestionRouter);
router.use(inputCodeRouter);
router.use(needNewCodeRouter);
router.use(documentsCheckRouter);
router.use(uploadDocumentsRouter);
router.use(checkYourAnswersRouter);

module.exports = router;
