const express = require('express');

const finalCommentRouter = require('../../final-comment/final-comment');
const commentsQuestionRouter = require('../../final-comment/comments-question');
const documentsCheckRouter = require('../../final-comment/documents-check');

const router = express.Router();

router.use(finalCommentRouter);
router.use(commentsQuestionRouter);
router.use(documentsCheckRouter);

module.exports = router;
