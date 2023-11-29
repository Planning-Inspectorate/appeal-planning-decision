const express = require('express');
const { list, get, getBylpaCode, create } = require('../controllers/local-planning-authorities');

const router = express.Router();

router.get('/', list);
router.get('/:id', get);
router.get('/lpaCode/:lpaCode', getBylpaCode);
router.post('/', create);

module.exports = router;
