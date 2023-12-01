const express = require('express');
const emailAddressController = require('../../controllers/appeal/email-address');

const router = express.Router();

router.get('/email-address', emailAddressController.get);

module.exports = router;
