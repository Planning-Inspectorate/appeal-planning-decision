const express = require('express');
const { getDocumentMetadata } = require('../services/document-metadata.service');
const router = express.Router();

router.get('/:caseref', async (req, res) => {
	let statusCode = 200;
	const caseRef = req.params.caseref;
	const documentType = req.query.documenttype;
	let body = '';

	try {
		body = await getDocumentMetadata(caseRef, documentType);
	} catch (error) {
		statusCode = error.code;
		body = error.message.errors;
	} finally {
		res.status(statusCode).send(body);
	}
});

module.exports = router;