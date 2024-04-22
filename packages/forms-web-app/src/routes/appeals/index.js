const express = require('express');

const router = express.Router();

const yourAppealsRouter = require('./your-appeals/index');
const noAppealsController = require('../../controllers/appeals/no-appeals');
const selectedAppealRouter = require('./selected-appeal/selected-appeal');
const dynamicSubmission = require('../appellant-submission/submission-form');
const { isFeatureActive } = require('../../featureFlag');
const { FLAG } = require('@pins/common/src/feature-flags');

router.use('/your-appeals', yourAppealsRouter);
router.get('/no-appeals', noAppealsController.get);

// householder appeals
router.use(
	'/householder',
	async (req, res, next) => {
		const lpaCode = req.session.appeal?.lpaCode;
		if (await isFeatureActive(FLAG.APPEAL_FORM_V2, lpaCode)) {
			next();
		} else {
			return res.status(404).render('error/not-found');
		}
	},
	dynamicSubmission
);

// todo: leave at end or fix the urls defined in these routes, currently catches anything else as :appealNumber
router.use('/', selectedAppealRouter);

module.exports = router;
