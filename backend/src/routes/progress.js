const express = require('express');
const { getProgress, getDashboardStats } = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);
router.get('/', getProgress);
router.get('/dashboard', getDashboardStats);

module.exports = router;
