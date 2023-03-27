const express = require('express');

const finalCommentRouter = require('../../final-comment/final-comment');
const finalCommentSubmittedRouter = require('../../final-comment/final-comment-submitted');
const appealClosedForCommentRouter = require('../../final-comment/appeal-closed-for-comment');
const commentsQuestionRouter = require('../../final-comment/comments-question');
const inputCodeRouter = require('../../final-comment/input-code');
const needNewCodeRouter = require('../../final-comment/need-new-code');
const documentsCheckRouter = require('../../final-comment/documents-check');
const uploadDocumentsRouter = require('../../final-comment/upload-documents');

const router = express.Router();

router.use(finalCommentRouter);
router.use(finalCommentSubmittedRouter);
router.use(appealClosedForCommentRouter);
router.use(commentsQuestionRouter);
router.use(inputCodeRouter);
router.use(needNewCodeRouter);
router.use(documentsCheckRouter);
router.use(uploadDocumentsRouter);

module.exports = router;
