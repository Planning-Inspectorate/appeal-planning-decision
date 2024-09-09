const express = require('express');

const selectedAppealController = require('../../../controllers/selected-appeal');
const appealDetailsController = require('../../../controllers/selected-appeal/appeal-details');
const questionnaireDetailsController = require('../../../controllers/selected-appeal/questionnaire-details');
const finalCommentsController = require('../../../controllers/selected-appeal/final-comments-details');
const interestedPartyDetailsController = require('../../../controllers/selected-appeal/ip-comment-details');
const statementDetailsController = require('../../../controllers/selected-appeal/statements');
const finalCommentsSubmissionRouter = require('../final-comments/final-comments');

const router = express.Router({ mergeParams: true });

router.get('/:appealNumber', selectedAppealController.get());
router.get('/:appealNumber/appeal-details', appealDetailsController.get());
router.get('/:appealNumber/questionnaire', questionnaireDetailsController.get());
router.get('/:appealNumber/final-comments', finalCommentsController.get());
router.get('/:appealNumber/lpa-final-comments', finalCommentsController.get());
router.get('/:appealNumber/interested-party-comments', interestedPartyDetailsController.get());
router.get('/:appealNumber/lpa-statement', statementDetailsController.get());
router.use('/:appealNumber/final-comments-submission', finalCommentsSubmissionRouter);

module.exports = router;
