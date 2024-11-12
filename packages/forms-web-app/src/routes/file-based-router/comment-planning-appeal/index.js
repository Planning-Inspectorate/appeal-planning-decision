const express = require('express');

const router = express.Router();

// To do - consider whether to have designated landing page for interested parties
router.get('/', (req, res) => res.redirect('./enter-appeal-reference'));

module.exports = { router };
