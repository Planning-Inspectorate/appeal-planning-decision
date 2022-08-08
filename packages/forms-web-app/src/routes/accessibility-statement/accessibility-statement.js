const express = require('express');
const {
	getAccessibilityStatement
} = require('../../controllers/accessibility-statement/accessibility-statement');

const router = express.Router();

router.get('/', getAccessibilityStatement);

module.exports = router;
