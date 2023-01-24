const express = require('express');
const youCannotAppealController = require('../../controllers/full-appeal/you-cannot-appeal');

const router = express.Router();
router.get('/you-cannot-appeal', youCannotAppealController.getYouCannotAppeal);

module.exports = router;
