const express = require('express');
const { getDocument } = require('../controllers/document');

const router = express.Router();

router.get('/:appealOrQuestionnaireId/:documentId', getDocument);

module.exports = router;
