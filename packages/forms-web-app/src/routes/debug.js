const express = require('express');
const {
	setCommentDeadline,
	radios,
	radios2,
	radios3,
	radios4,
	radios5
} = require('../controllers/debug');

const router = express.Router();

router.get('/set-comment-deadline', setCommentDeadline);

router.get('/radios', radios);
router.get('/radios2', radios2);
router.get('/radios3', radios3);
router.get('/radios4', radios4);
router.get('/radios5', radios5);

module.exports = router;
