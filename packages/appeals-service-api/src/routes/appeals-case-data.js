const express = require('express');
const router = express.Router();

const {
	getAppealsByLpaCode,
	getAppealByCaseRefAndLpaCode
} = require('../controllers/appeals-case-data');

router.get('/:lpaCode', getAppealsByLpaCode);
router.get('/:lpaCode/:caseRef', getAppealByCaseRefAndLpaCode);

module.exports = router;