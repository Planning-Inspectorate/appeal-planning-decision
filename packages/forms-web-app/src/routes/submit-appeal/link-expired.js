const express = require('express');
const { getLinkExpired } = require('../../controllers/submit-appeal/link-expired');

const router = express.Router();

router.get('/link-expired', getLinkExpired);

module.exports = router;
