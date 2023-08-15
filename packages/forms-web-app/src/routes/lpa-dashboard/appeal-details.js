const express = require('express');
const { getAppealDetails } = require('../../controllers/lpa-dashboard/appeal-details');
const router = express.Router();

router.get('/appeal-details/:id', getAppealDetails);

module.exports = router;
