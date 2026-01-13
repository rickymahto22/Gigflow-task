const express = require('express');
const router = express.Router();
const { placeBid, getBidsByGig, hireFreelancer, getMyBids } = require('../controllers/bidController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, placeBid);
router.get('/my', protect, getMyBids);
router.get('/:gigId', protect, getBidsByGig);
router.patch('/:bidId/hire', protect, hireFreelancer);

module.exports = router;
