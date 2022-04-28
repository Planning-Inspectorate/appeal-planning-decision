const express = require('express');
const beforeYouStartController = require('../../controllers/before-you-start/before-you-start');

const router = express.Router();

router.get('/', beforeYouStartController.getBeforeYouStartFirstPage);

module.exports = router;
