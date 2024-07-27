const express = require('express');
const { setCommentDeadline } = require('../controllers/debug');

const router = express.Router();

router.get('/set-comment-deadline', setCommentDeadline);

module.exports = router;
