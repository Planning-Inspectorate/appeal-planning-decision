const express = require('express');

const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const {
	getListOfDocuments,
	postListOfDocuments
} = require('../../../controllers/full-appeal/submit-appeal/list-of-documents');
const router = express.Router();

router.get(
	'/submit-appeal/list-of-documents-v1',
	[fetchExistingAppealMiddleware],
	getListOfDocuments
);
router.post('/submit-appeal/list-of-documents-v1', postListOfDocuments);

module.exports = router;
