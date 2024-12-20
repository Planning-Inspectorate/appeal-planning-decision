const express = require('express');
const router = express.Router({ mergeParams: true });

const selectedAppealController = require('../../controllers/selected-appeal');
const appealDetailsController = require('../../controllers/selected-appeal/appeal-details');
const questionnaireDetailsController = require('../../controllers/selected-appeal/questionnaire-details');
const finalCommentsController = require('../../controllers/selected-appeal/final-comments-details');
const interestedPartyCommentsController = require('../../controllers/selected-appeal/ip-comment-details');
const statementDetailsController = require('../../controllers/selected-appeal/statements');
const planningObligationDetailsController = require('../../controllers/selected-appeal/planning-obligation-details');
const downloadDocumentsController = require('../../controllers/selected-appeal/downloads/documents');

router.get('/:appealNumber', selectedAppealController.get('layouts/lpa-dashboard/main.njk'));
router.get(
	'/:appealNumber/appeal-details',
	appealDetailsController.get('layouts/lpa-dashboard/main.njk')
);
router.get(
	'/:appealNumber/questionnaire',
	questionnaireDetailsController.get('layouts/lpa-dashboard/main.njk')
);
router.get(
	`/:appealNumber/download/:documentsLocation/documents/:appealCaseStage`,
	downloadDocumentsController.get()
);
router.get(
	'/:appealNumber/final-comments',
	finalCommentsController.get('layouts/lpa-dashboard/main.njk')
);
router.get(
	'/:appealNumber/appellant-final-comments',
	finalCommentsController.get('layouts/lpa-dashboard/main.njk')
);
router.get(
	'/:appealNumber/interested-party-comments',
	interestedPartyCommentsController.get('layouts/lpa-dashboard/main.njk')
);
router.get(
	'/:appealNumber/statement',
	statementDetailsController.get('layouts/lpa-dashboard/main.njk')
);
router.get(
	'/:appealNumber/appellant-planning-obligation',
	planningObligationDetailsController.get('layouts/lpa-dashboard/main.njk')
);

module.exports = router;
