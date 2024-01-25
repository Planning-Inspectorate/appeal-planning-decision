const express = require('express');
const { postSaveAndReturn } = require('../../controllers/appeal-householder-decision/save');

const router = express.Router();

router.post('/save-and-return', postSaveAndReturn);

module.exports = router;
