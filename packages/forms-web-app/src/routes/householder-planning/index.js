/* eslint-disable import/no-unresolved */
const express = require('express');

const listedBuildingRouter = require('./listed-building');

const router = express.Router();

router.use(listedBuildingRouter);

module.exports = router;
