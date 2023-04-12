const express = require('express');

const { getCodeExpired } = require('../../controllers/appeal-householder-decision/code-expired');

const router = express.Router();

router.get('/code-expired', getCodeExpired);

module.exports = router;
