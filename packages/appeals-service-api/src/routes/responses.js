const express = require('express');
const { patchResponseByReferenceId } = require('../controllers/responses');
const router = express.Router();

router.patch('/:formId/:referenceId', patchResponseByReferenceId);

module.exports = router;
