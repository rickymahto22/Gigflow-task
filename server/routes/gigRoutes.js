const express = require('express');
const router = express.Router();
const { getGigs, getGigById, createGig, getMyGigs } = require('../controllers/gigController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getGigs).post(protect, createGig);
router.get('/my', protect, getMyGigs);
router.route('/:id').get(getGigById);

module.exports = router;
