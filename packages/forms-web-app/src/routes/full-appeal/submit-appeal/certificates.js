const express = require('express');
const router = express.Router();

const certificatesController = require('../../../controllers/full-appeal/submit-appeal/certificates');

router.get('/submit-appeal/certificates', certificatesController.getCertificates);

module.exports = router;
