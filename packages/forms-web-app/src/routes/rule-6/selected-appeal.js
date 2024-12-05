const express = require('express');
const router = express.Router({ mergeParams: true });

const selectedAppealController = require('../../controllers/selected-appeal');
const appealDetailsController = require('../../controllers/selected-appeal/appeal-details');
const questionnaireDetailsController = require('../../controllers/selected-appeal/questionnaire-details');
// const finalCommentsController = require('../../controllers/selected-appeal/final-comments-details');
// const interestedPartyCommentsController = require('../../controllers/selected-appeal/ip-comment-details');
const statementDetailsController = require('../../controllers/selected-appeal/statements');
const planningObligationDetailsController = require('../../controllers/selected-appeal/planning-obligation-details');

router.get('/:appealNumber', selectedAppealController.get());
router.get('/:appealNumber/appeal-details', appealDetailsController.get());
router.get('/:appealNumber/questionnaire', questionnaireDetailsController.get());
// router.get('/:appealNumber/final-comments', finalCommentsController.get());
// router.get('/:appealNumber/appellant-final-comments', finalCommentsController.get());
// router.get('/:appealNumber/interested-party-comments', interestedPartyCommentsController.get());
router.get('/:appealNumber/statement', statementDetailsController.get());
router.get('/:appealNumber/planning-obligation', planningObligationDetailsController.get());

module.exports = router;
