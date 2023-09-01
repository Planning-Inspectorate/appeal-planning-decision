const express = require('express');
const {
	patchResponseByReferenceId,
	getResponseByReferenceId
} = require('../controllers/responses');
const router = express.Router();

router.patch('/:journeyId/:referenceId', patchResponseByReferenceId);
router.get('/:journeyId/:referenceId/:projection?', getResponseByReferenceId);

module.exports = router;
