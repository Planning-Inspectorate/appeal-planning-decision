const express = require('express');
const { booleanQuestions } = require('../../lib/questionTypes');
const { booleanQuestionController } = require('../../controllers/question-type');
const fetchExistingAppealReplyMiddleware = require('../../middleware/fetch-existing-appeal-reply');
const fetchAppealMiddleware = require('../../middleware/fetch-appeal');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const booleanQuestionRules = require('../../validators/question-type/boolean');

const router = express.Router();

booleanQuestions.forEach((question) => {
  /* istanbul ignore next */
  const getConfig = (_, res, next) => {
    res.locals.question = question;
    next();
  };

  router.get(
    `/appeal-questionnaire/:id/${question.url}`,
    [fetchAppealMiddleware, fetchExistingAppealReplyMiddleware],
    getConfig,
    booleanQuestionController.getBooleanQuestion
  );

  router.post(
    `/appeal-questionnaire/:id/${question.url}`,
    booleanQuestionRules(question.emptyError, question.text),
    validationErrorHandler,
    getConfig,
    booleanQuestionController.postBooleanQuestion
  );
});

module.exports = router;
