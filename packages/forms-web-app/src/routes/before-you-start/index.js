const express = require('express');
const anyOfFollowingRouter = require('./any-of-following');
const {
  rules: anyOfFollowingRules,
} = require('../../validators/before-you-start/any-of-following');

const router = express.Router();

router.use('/any-of-following', anyOfFollowingRules(), anyOfFollowingRouter);

module.exports = router;
