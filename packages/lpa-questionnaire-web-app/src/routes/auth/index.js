const express = require('express');
const authenticationRouter = require('./authentication');

const router = express.Router();

router.use(authenticationRouter);
module.exports = router;
