const express = require('express');

const router = express.Router();

const yourAppealsRouter = require('./your-appeals/index');
const noAppealsController = require('../../controllers/appeals/no-appeals');
const selectedAppealRouter = require('./selected-appeal/selected-appeal');
const finalCommentsRouter = require('./final-comments/index');
const dynamicSubmission = require('../appellant-submission/submission-form');
const proofEvidenceRouter = require('./proof-evidence/index');

router.use('/your-appeals', yourAppealsRouter);
router.get('/no-appeals', noAppealsController.get);

// householder appeals
router.use('/householder', dynamicSubmission);

// s78 appeals
router.use('/full-planning', dynamicSubmission);
router.use('/final-comments', finalCommentsRouter);
router.use('/proof-evidence', proofEvidenceRouter);

// s20 appeals
router.use('/listed-building', dynamicSubmission);

// todo: leave at end or fix the urls defined in these routes, currently catches anything else as :appealNumber
router.use('/', selectedAppealRouter);

module.exports = router;
