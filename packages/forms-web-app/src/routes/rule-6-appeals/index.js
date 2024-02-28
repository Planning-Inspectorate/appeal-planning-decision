const express = require('express');
const router = express.Router();

const selectedAppealController = require('../../controllers/selected-appeal/selected-appeal');
const appealDetailsController = require('../../controllers/selected-appeal/appeal-details/appeal-details');

router.get('/:appealNumber', selectedAppealController.get);
router.get('/:appealNumber/appeal-details', appealDetailsController.get);

module.exports = router;
