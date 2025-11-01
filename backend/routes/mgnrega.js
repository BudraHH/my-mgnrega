const express = require('express');
const router = express.Router();
const { getDistrict, getStateList, getStateAvg } = require('../controllers/mgnregaController');
const cacheMiddleware = require('../middleware/cache');

router.get('/district', cacheMiddleware, getDistrict);
router.get('/districts', cacheMiddleware, getStateList);
router.get('/state-average', cacheMiddleware, getStateAvg);
module.exports = router;