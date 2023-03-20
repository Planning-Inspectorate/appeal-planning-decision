const express = require('express');

const finalCommentRouter = require('../../final-comment/final-comment');
const finalCommentSubmittedRouter = require('../../final-comment/final-comment-submitted');
const commentsQuestionRouter = require('../../final-comment/comments-question');
const documentsCheckRouter = require('../../final-comment/documents-check');
const uploadDocumentsRouter = require('../../final-comment/upload-documents');

const router = express.Router();

router.use(finalCommentRouter);
router.use(finalCommentSubmittedRouter);
router.use(commentsQuestionRouter);
router.use(documentsCheckRouter);
router.use(uploadDocumentsRouter);

module.exports = router;
