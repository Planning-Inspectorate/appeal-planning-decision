const express = require('express');
const router = express.Router({ mergeParams: true });

const selectedAppealController = require('../../controllers/selected-appeal');
const appealDetailsController = require('../../controllers/selected-appeal/appeal-details');
const questionnaireDetailsController = require('../../controllers/selected-appeal/questionnaire-details');
const finalCommentsController = require('../../controllers/selected-appeal/final-comments-details');
const interestedPartyCommentsController = require('../../controllers/selected-appeal/ip-comment-details');

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

module.exports = router;
