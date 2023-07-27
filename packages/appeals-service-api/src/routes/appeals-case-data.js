const express = require('express');
const router = express.Router();

const { getAppealsByLpaCode } = require('../controllers/appeals-case-data');

router.get('/:lpaCode', getAppealsByLpaCode);

module.exports = router;
