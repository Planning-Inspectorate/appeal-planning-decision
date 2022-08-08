const express = require('express');
const accessibilityStatementController = require('../../controllers/accessibility-statement/accessibility-statement');

const router = express.Router();

router.get('/', accessibilityStatementController.getAccessibilityStatement);

module.exports = router;
