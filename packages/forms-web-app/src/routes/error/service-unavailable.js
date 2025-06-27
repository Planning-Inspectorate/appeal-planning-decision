const express = require('express');
const serviceUnavailableController = require('../../controllers/error/service-unavailable');

const router = express.Router();

router.get('/service-unavailable', serviceUnavailableController.getServiceUnavailable);

module.exports = router;
