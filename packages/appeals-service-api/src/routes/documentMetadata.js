const express = require('express');
const ApiError = require('../errors/apiError');
const {
	getDocumentMetadata,
	createOrUpdateDocumentMetadata
} = require('../services/document-metadata.service');
const router = express.Router();
const { mapUpdateResponse } = require('../mappers/mongo-response-mapper');

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
		body = error.message.errors;
	}

	res.status(statusCode).send(body);
});

/**
 * Update or create a document metadata record
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
router.put('/:id', async (req, res) => {
	let statusCode = 200;
	let body = {};

	try {
		req.body.documentId = req.params.id;
		const result = await createOrUpdateDocumentMetadata(req.body);
		body = mapUpdateResponse(result);
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
