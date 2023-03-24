const express = require('express');
const appealClosedForCommentController = require('../../controllers/final-comment/appeal-closed-for-comment');

const router = express.Router();

router.get(
	'/appeal-closed-for-comment',
	appealClosedForCommentController.getAppealClosedForComment
);

module.exports = router;
