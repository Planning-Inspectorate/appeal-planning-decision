const express = require('express');
const { getWithdrawnAppeals } = require('../../controllers/lpa-dashboard/withdrawn-appeals');

const router = express.Router();

router.get('/withdrawn-appeals', getWithdrawnAppeals);

module.exports = router;
