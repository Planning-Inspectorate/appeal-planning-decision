const express = require('express');
const router = express.Router();

const { getAppealsByLpaCode } = require('../controllers/lpa-dashboard-appeals');

router.get('/:lpaCode', getAppealsByLpaCode);

module.exports = router;
