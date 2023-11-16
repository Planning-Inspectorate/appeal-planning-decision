const express = require('express');

const router = express.Router();

const helloWorldRouter = require('./hello-world/routes');

router.use('/hello', helloWorldRouter);

module.exports = router;
