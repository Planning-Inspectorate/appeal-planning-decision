const express = require('express');
const { postGeneratePdf } = require('../controllers/pdf');
const multer = require('multer');
const config = require('../config');

const router = express.Router();

router.post(
	'/generate',
	multer({
		limits: { fileSize: config.fileUpload.maxSizeInBytes },
		dest: config.fileUpload.path
	}).single('html'),
	postGeneratePdf
);

module.exports = router;
