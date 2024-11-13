const express = require('express');

const router = express.Router();

router.get('/problem-with-service', () => {
	// Force render of problem with service error page
	throw new Error('Test error');
});

module.exports = router;
