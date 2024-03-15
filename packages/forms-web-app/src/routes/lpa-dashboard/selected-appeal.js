const express = require('express');
const router = express.Router({ mergeParams: true });

const selectedAppealController = require('../../controllers/selected-appeal');
const appealDetailsController = require('../../controllers/selected-appeal/appeal-details');

router.get('/:appealNumber', selectedAppealController.get('layouts/lpa-dashboard/main.njk'));
router.get(
	'/:appealNumber/appeal-details',
	appealDetailsController.get('layouts/lpa-dashboard/main.njk')
);

module.exports = router;
