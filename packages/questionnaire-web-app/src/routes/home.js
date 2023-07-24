const express = require('express');
const indexController = require('../controllers');
const questionnaireController = require('../controllers/questionnaire');
const {validate} = require('../validator/validator')
const { validationErrorHandler } = require('../validator/validation-error-handler');

const router = express.Router();

//Routes for questionnaire
router.get('/questionnaire/:appealId/:section/:question', questionnaireController.question);
router.post('/questionnaire/:appealId/:section/:question',validate(), validationErrorHandler, questionnaireController.save);
router.get('/questionnaire/:appealId', questionnaireController.list);


/* GET home page. */
router.get('/', indexController.getIndex);

module.exports = router;
