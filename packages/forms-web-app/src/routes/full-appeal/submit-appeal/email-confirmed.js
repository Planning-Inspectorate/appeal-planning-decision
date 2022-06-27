const express = require('express');

const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const {
  getEmailConfirmed,
  postEmailConfirmed,
} = require('../../../controllers/full-appeal/submit-appeal/email-confirmed');

const router = express.Router();

router.get('/submit-appeal/email-confirmed', [fetchExistingAppealMiddleware], getEmailConfirmed);
router.post('/submit-appeal/email-confirmed', postEmailConfirmed);

module.exports = router;
