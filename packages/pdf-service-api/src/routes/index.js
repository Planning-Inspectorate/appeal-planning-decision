const express = require('express');
const pdfRouter = require('./pdf');

const router = express.Router();

/**
 * index route to avoid azure always on ping 404s
 */
router.get('/', (req, res) => {
	res.sendStatus(204);
});

router.use('/api/v1', pdfRouter);

module.exports = router;
