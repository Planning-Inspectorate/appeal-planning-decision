const express = require('express');

const finalCommentRouter = require('../../final-comment/final-comment');

const router = express.Router();

router.use(finalCommentRouter);

module.exports = router;
