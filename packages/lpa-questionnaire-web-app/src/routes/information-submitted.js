const express = require('express');
const informationSubmittedController = require('../controllers/information-submitted');
const fetchAppealMiddleware = require('../middleware/common/fetch-appeal');

const router = express.Router();

router.get(
  '/appeal-questionnaire/:id/information-submitted',
  fetchAppealMiddleware,
  informationSubmittedController.getInformationSubmitted
);
router.post(
  '/appeal-questionnaire/:id/information-submitted',
  fetchAppealMiddleware,
  informationSubmittedController.postInformationSubmitted
);

module.exports = router;
