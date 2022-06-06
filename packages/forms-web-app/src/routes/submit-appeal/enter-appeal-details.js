const express = require('express');
const enterAppealDetailsController = require('../../controllers/submit-appeal/enter-appeal-details');

const router = express.Router();

router.get('/enter-appeal-details', enterAppealDetailsController.getEnterAppealDetails);

module.exports = router;
