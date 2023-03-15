const express = require('express');
const finalCommentSubmittedController = require('../../controllers/final-comment/final-comment-submitted');

const router = express.Router();

router.get('/final-comment-submitted', finalCommentSubmittedController.getFinalCommentSubmitted);

module.exports = router;
