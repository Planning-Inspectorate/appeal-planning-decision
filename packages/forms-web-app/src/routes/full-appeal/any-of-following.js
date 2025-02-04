const {
	constants: { APPLICATION_CATEGORIES }
} = require('@pins/business-rules');
const express = require('express');
const {
	getAnyOfFollowing,
	postAnyOfFollowing
} = require('../../controllers/full-appeal/any-of-following');
const { buildCheckboxValidation } = require('../../validators/common/checkboxes');
const { validationErrorHandler } = require('../../validators/validation-error-handler');

// this router only used for v1 appeals

const router = express.Router();

router.get('/any-of-following', getAnyOfFollowing);
router.post(
	'/any-of-following',
	buildCheckboxValidation('any-of-following', Object.values(APPLICATION_CATEGORIES), {
		notEmptyMessage: 'Select if your appeal is about any of the following'
	}),
	validationErrorHandler,
	postAnyOfFollowing
);

module.exports = router;
