const express = require('express');

const {
	getEnterCode,
	postEnterCode
} = require('../../../controllers/full-appeal/submit-appeal/enter-code');
const { rules: ruleEnterCode } = require('../../../validators/save-and-return/enter-code');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');

const router = express.Router();

router.get('/submit-appeal/enter-code/:id', [fetchExistingAppealMiddleware], getEnterCode);

router.post('/submit-appeal/enter-code/', ruleEnterCode(), validationErrorHandler, postEnterCode);

module.exports = router;
