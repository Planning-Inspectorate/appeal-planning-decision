const express = require('express');
const {
  getAnyOfFollowing,
  postAnyOfFollowing,
} = require('../../controllers/full-appeal/any-of-following');
const { rules: anyOfFollowingRules } = require('../../validators/full-appeal/any-of-following');
const { validationErrorHandler } = require('../../validators/validation-error-handler');

const router = express.Router();

router.get('/any-of-following', getAnyOfFollowing);
router.post('/any-of-following', anyOfFollowingRules(), validationErrorHandler, postAnyOfFollowing);

module.exports = router;
