const express = require('express');
const { CASE_TYPES } = require('@pins/common/src/database/data-static');

const router = express.Router();

const yourAppealsRouter = require('./your-appeals/index');
const noAppealsController = require('../../controllers/appeals/no-appeals');
const selectedAppealRouter = require('./selected-appeal/selected-appeal');
const finalCommentsRouter = require('./final-comments/index');
const dynamicSubmission = require('../appellant-submission/submission-form');
const proofEvidenceRouter = require('./proof-evidence/index');

router.get('/', (_, res) => res.redirect('/appeals/your-appeals'));
router.use('/your-appeals', yourAppealsRouter);
router.get('/no-appeals', noAppealsController.get);

// householder appeals
router.use(`/${CASE_TYPES.HAS.friendlyUrl}`, dynamicSubmission);

// s78 appeals
router.use(`/${CASE_TYPES.S78.friendlyUrl}`, dynamicSubmission);

// s20 appeals
router.use(`/${CASE_TYPES.S20.friendlyUrl}`, dynamicSubmission);

// adverts
router.use(`/${CASE_TYPES.ADVERTS.friendlyUrl}`, dynamicSubmission);

// cas planning (minor commercial)
router.use(`/${CASE_TYPES.CAS_PLANNING.friendlyUrl}`, dynamicSubmission);

// cas adverts
router.use(`/${CASE_TYPES.CAS_ADVERTS.friendlyUrl}`, dynamicSubmission);

// enforcement notice
router.use(`/${CASE_TYPES.ENFORCEMENT.friendlyUrl}`, dynamicSubmission);

// enforcement listed building
router.use(`/${CASE_TYPES.ENFORCEMENT_LISTED.friendlyUrl}`, dynamicSubmission);

// LDC lawful development certificate
router.use(`/${CASE_TYPES.LDC.friendlyUrl}`, dynamicSubmission);

// reps
router.use('/final-comments', finalCommentsRouter);
router.use('/proof-evidence', proofEvidenceRouter);

// todo: leave at end or fix the urls defined in these routes, currently catches anything else as :appealNumber
router.use('/', selectedAppealRouter);

module.exports = router;
