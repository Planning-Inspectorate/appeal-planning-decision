const express = require('express');

const {
  getCodeExpired,
  postCodeExpired,
} = require('../../controllers/appeal-householder-decision/code-expired');

const router = express.Router();

router.get('/code-expired', getCodeExpired);
router.post('/code-expired', postCodeExpired);

module.exports = router;
