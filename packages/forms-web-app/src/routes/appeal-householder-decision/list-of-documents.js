const express = require('express');

const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');
const {
	getListOfDocuments,
	postListOfDocuments
} = require('../../controllers/appeal-householder-decision/list-of-documents');
const router = express.Router();

router.get('/list-of-documents', [fetchExistingAppealMiddleware], getListOfDocuments);
router.post('/list-of-documents', postListOfDocuments);

module.exports = router;
