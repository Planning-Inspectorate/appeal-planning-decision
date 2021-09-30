const express = require('express');
const pdfRouter = require('./pdf');

const router = express.Router();

router.use('/api/v1', pdfRouter);

module.exports = router;
