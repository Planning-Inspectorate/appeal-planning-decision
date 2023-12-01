const express = require('express');
const { list, getByCaseReference, getCount } = require('./controller');
const router = express.Router();

router.get('/', list);
router.get('/count', getCount);
router.get('/:caseReference', getByCaseReference);

module.exports = { router };
