import express = require('express');

const adRoutes = require('./adRoutes');
const userRoutes = require('./userRoutes');

const router = express.Router();

router.use('/store', adRoutes);
router.use('/users', userRoutes);

module.exports = router;