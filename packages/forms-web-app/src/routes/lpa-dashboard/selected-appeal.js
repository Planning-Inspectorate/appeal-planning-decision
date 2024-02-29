const express = require('express');
const router = express.Router({ mergeParams: true });

const selectedAppealController = require('../../controllers/selected-appeal');
const appealDetailsController = require('../../controllers/selected-appeal/appeal-details');

router.get('/:appealNumber', selectedAppealController.get);
router.get('/:appealNumber/appeal-details', appealDetailsController.get);

module.exports = router;
