const express = require('express');

const selectedAppealController = require('../../../controllers/selected-appeal/selected-appeal');

const router = express.Router();

router.get('/:appealNumber', selectedAppealController.get);

module.exports = router;
