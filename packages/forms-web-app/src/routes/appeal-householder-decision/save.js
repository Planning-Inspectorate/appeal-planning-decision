const express = require('express');
const { postSaveAndReturn } = require('../../controllers/appeal-householder-decision/save');

const router = express.Router();

router.post('/', postSaveAndReturn);

module.exports = router;
