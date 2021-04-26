const express = require('express');
const informationSubmittedController = require('../controllers/information-submitted');

const router = express.Router();

router.get('/:id/information-submitted', informationSubmittedController.getInformationSubmitted);
router.post('/:id/information-submitted', informationSubmittedController.postInformationSubmitted);

module.exports = router;
