const express = require('express');
const anyOfFollowingRouter = require('./any-of-following');

const router = express.Router();

router.use('/any-of-following', anyOfFollowingRouter);

module.exports = router;
