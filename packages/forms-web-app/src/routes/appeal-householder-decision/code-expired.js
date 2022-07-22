const express = require('express');

const {
  getCodeExpired,
  postCodeExpired,
} = require('../../controllers/appeal-householder-decision/code-expired');

const router = express.Router();

router.get('/appeal-householder-decision/code-expired', getCodeExpired);
router.post('/appeal-householder-decision/code-expired', postCodeExpired);

module.exports = router;
