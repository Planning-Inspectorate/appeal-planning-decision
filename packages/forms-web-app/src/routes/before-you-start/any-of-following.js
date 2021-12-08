const express = require('express');

const {
  getAnyOfFollowing,
  postAnyOfFollowing,
} = require('../../controllers/before-you-start/any-of-following');
const {
  rules: anyOfFollowingRules,
} = require('../../validators/before-you-start/any-of-following');
const { validationErrorHandler } = require('../../validators/validation-error-handler');

const router = express.Router();

router.get('/', getAnyOfFollowing);
router.post('/', anyOfFollowingRules(), validationErrorHandler, postAnyOfFollowing);

module.exports = router;
