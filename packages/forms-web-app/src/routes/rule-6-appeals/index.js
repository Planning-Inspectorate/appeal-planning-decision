const express = require('express');
const router = express.Router();

const selectedAppealController = require('../../controllers/selected-appeal');
const appealDetailsController = require('../../controllers/selected-appeal/appeal-details');
const questionnaireDetailsController = require('../../controllers/selected-appeal/questionnaire-details');

// login
router.use(require('./email-address'));
router.use(require('./enter-code'));
router.use(require('./need-new-code'));
router.use(require('./request-new-code'));

router.get('/:appealNumber', selectedAppealController.get());
router.get('/:appealNumber/appeal-details', appealDetailsController.get());
router.get('/:appealNumber/questionnaire', questionnaireDetailsController.get());

module.exports = router;
