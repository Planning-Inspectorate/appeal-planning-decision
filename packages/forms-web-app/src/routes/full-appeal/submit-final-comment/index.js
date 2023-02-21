const express = require('express');

const finalCommentRouter = require('../../final-comment/final-comment');
const commentsQuestionRouter = require('../../final-comment/comments-question');

const router = express.Router();

router.use(finalCommentRouter);
router.use(commentsQuestionRouter);

module.exports = router;
