const express = require('express');
const router = express.Router();

const peopleRouter = require('./people');
const planetRouter = require('./planets');

router.use('/people', peopleRouter);
router.use('/planets', planetRouter);

module.exports = router;
