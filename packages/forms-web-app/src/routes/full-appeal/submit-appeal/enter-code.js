const express = require('express');

const { getEnterCode } = require('../../../controllers/full-appeal/submit-appeal/enter-code');

const router = express.Router();

router.get('/submit-appeal/enter-code/:token', getEnterCode);

module.exports = router;
