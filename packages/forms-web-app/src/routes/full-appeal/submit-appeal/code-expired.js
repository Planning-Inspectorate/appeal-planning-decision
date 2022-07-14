const express = require('express');

const {
  getCodeExpired,
  postCodeExpired,
} = require('../../../controllers/full-appeal/submit-appeal/code-expired');

const router = express.Router();

router.get('/submit-appeal/code-expired', getCodeExpired);
router.post('/submit-appeal/code-expired', postCodeExpired);

module.exports = router;
