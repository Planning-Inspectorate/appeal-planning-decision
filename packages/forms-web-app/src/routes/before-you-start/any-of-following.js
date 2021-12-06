const express = require('express');

const {
  getAnyOfFollowing,
  postAnyOfFollowing,
} = require('../../controllers/before-you-start/any-of-following');
const {
  rules: anyOfFollowingRules,
} = require('../../validators/before-you-start/any-of-following');

const router = express.Router();

router.get('/', getAnyOfFollowing);
router.post('/', anyOfFollowingRules(), postAnyOfFollowing);

module.exports = router;
