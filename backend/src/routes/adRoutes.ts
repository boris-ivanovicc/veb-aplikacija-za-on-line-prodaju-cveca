import express = require('express');
const adController = require('../controllers/adController');

const router = express.Router();

router.get('/', adController.getActiveAds);
router.get('/:id', adController.getAdById);

module.exports = router;