const express = require('express');

const router = express.Router();

const listedBuildingHouseholderRouter = require('./listed-building-householder');

router.use(listedBuildingHouseholderRouter);

module.exports = router;
