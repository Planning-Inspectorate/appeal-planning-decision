const express = require('express');
const beforeYouStartController = require('../../controllers/before-you-start/before-you-start');

const router = express.Router();

router.get('/', beforeYouStartController.getBeforeYouStartFirstPage);
router.post('/', beforeYouStartController.postBeforeYouStartFirstPage);

module.exports = router;
