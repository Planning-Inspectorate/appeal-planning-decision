const express = require('express');
const contactUsController = require('../controllers/contact-us');

const router = express.Router();

router.get('/contact-us', contactUsController.modules.renderContactUs);

module.exports = router;
