const express = require('express');

const selectedAppealController = require('../../../controllers/selected-appeal');
const appealDetailsController = require('../../../controllers/selected-appeal/appeal-details');

const router = express.Router({ mergeParams: true });

router.get('/:appealNumber', selectedAppealController.get);
router.get('/:appealNumber/appeal-details', appealDetailsController.get);

module.exports = router;
