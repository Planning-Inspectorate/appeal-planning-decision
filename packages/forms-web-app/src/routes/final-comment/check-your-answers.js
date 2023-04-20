const express = require('express');

const checkYourAnswersController = require('../../controllers/final-comment/check-your-answers');

const router = express.Router();

router.get('/check-your-answers', checkYourAnswersController.getCheckYourAnswers);
router.post('/check-your-answers', checkYourAnswersController.postCheckYourAnswers);

module.exports = router;
