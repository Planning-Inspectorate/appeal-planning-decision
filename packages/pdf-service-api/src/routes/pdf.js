const express = require('express');
const multer = require('multer');
const { postGeneratePdf } = require('../controllers/pdf');
const config = require('../config');

const router = express.Router();

router.post('/generate', multer(config.fileUpload).single('html'), postGeneratePdf);

module.exports = router;
