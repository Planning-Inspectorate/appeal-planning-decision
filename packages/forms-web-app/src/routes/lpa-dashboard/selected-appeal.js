const express = require('express');
const router = express.Router();

const selectedAppealController = require('../../controllers/selected-appeal/selected-appeal');

router.get('/:appealNumber', selectedAppealController.get);

module.exports = router;
