const express = require('express');
const fetchExistingAppealReplyMiddleware = require('../middleware/fetch-existing-appeal-reply');
const confirmAnswersController = require('../controllers/confirm-answers');

const router = express.Router();

router.get('/:id/confirm-answers', [fetchExistingAppealReplyMiddleware], confirmAnswersController);

module.exports = router;
