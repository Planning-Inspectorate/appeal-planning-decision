const express = require('express');

const selectedAppealController = require('../../../controllers/selected-appeal/selected-appeal');

const router = express.Router();

router.get('/:appealNumber/appeal', selectedAppealController.get);

module.exports = router;
