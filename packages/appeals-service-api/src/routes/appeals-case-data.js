const express = require('express');
const router = express.Router();

const {
	getAppealsByLpaCode,
	getAppealByCaseRefAndLpaCode,
	postAppealCase
} = require('../controllers/appeals-case-data');

router.get('/:lpaCode', getAppealsByLpaCode);
router.get('/:lpaCode/:caseRef', getAppealByCaseRefAndLpaCode);
router.post('/', postAppealCase);
module.exports = router;
