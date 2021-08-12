const express = require('express');
const informationSubmittedController = require('../controllers/information-submitted');
const fetchAppealMiddleware = require('../middleware/fetch-appeal');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.get(
  '/:id/information-submitted',
  authenticate,
  fetchAppealMiddleware,
  informationSubmittedController.getInformationSubmitted
);
router.post(
  '/:id/information-submitted',
  authenticate,
  fetchAppealMiddleware,
  informationSubmittedController.postInformationSubmitted
);

module.exports = router;
