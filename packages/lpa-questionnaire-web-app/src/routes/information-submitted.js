const express = require('express');
const informationSubmittedController = require('../controllers/information-submitted');
const fetchAppealMiddleware = require('../middleware/fetch-appeal');

const router = express.Router();

router.get(
  '/:id/information-submitted',
  fetchAppealMiddleware,
  informationSubmittedController.getInformationSubmitted
);
router.post(
  '/:id/information-submitted',
  fetchAppealMiddleware,
  informationSubmittedController.postInformationSubmitted
);

module.exports = router;
