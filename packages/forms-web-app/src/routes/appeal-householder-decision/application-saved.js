const express = require('express');
const {
	getApplicationSaved
} = require('../../controllers/appeal-householder-decision/application-saved');

const router = express.Router();

router.get('/application-saved', getApplicationSaved);

module.exports = router;
