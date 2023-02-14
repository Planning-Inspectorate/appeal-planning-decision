const express = require('express');
const applicationSavedController = require('../../controllers/application-saved');

const router = express.Router();

router.get('/application-saved', applicationSavedController.getApplicationSaved);

module.exports = router;
