const express = require('express');
const informationSubmittedController = require('../controllers/information-submitted');

const router = express.Router();

router.get('/:id/information-submitted', informationSubmittedController.getInformationSubmitted);

module.exports = router;
