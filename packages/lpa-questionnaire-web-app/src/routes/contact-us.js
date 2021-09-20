const express = require('express');
const contactUsController = require('../controllers/contact-us');

const router = express.Router();

router.get('/appeal-questionnaire/contact-us', contactUsController.getContactUs);

module.exports = router;
