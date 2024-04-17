const express = require('express');
const { setCommentDeadline, createHASAppeal } = require('../controllers/debug');

const router = express.Router();

router.get('/set-comment-deadline', setCommentDeadline);
router.get('/create-has-appeal', createHASAppeal);

module.exports = router;
