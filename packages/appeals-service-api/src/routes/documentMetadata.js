const express = require('express');
const ApiError = require('../errors/apiError');
const { getDocumentMetadata } = require('../services/document-metadata.service');
const router = express.Router();

router.get('/case/:caseref', async (req, res) => {
	let statusCode = 200;
	const caseRef = req.params.caseref;
	const documentType = req.query.documenttype;
	const returnMultipleDocuments = req.query.returnMultipleDocuments;
	let body = {};

	try {
		body = await getDocumentMetadata(caseRef, documentType, returnMultipleDocuments);
	} catch (error) {
		if (!(error instanceof ApiError)) {
			throw error;
		}

		statusCode = error.code;
		body = error?.message?.errors;
	}

	res.status(statusCode).send(body);
});

module.exports = router;
