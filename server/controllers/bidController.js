const mongoose = require('mongoose');
const Bid = require('../models/Bid');
const Gig = require('../models/Gig');

// @desc    Place a bid
// @route   POST /api/bids
// @access  Private
const placeBid = async (req, res) => {
    const { gigId, message, price } = req.body;

    const gig = await Gig.findById(gigId);
    if (!gig) {
        res.status(404).json({ message: 'Gig not found' });
        return;
    }

    if (gig.status !== 'open') {
        res.status(400).json({ message: 'Gig is not open' });
        return;
    }

    const existingBid = await Bid.findOne({ gigId, freelancerId: req.user._id });
    if (existingBid) {
        res.status(400).json({ message: 'You have already bid on this gig' });
        return;
    }

    const bid = new Bid({
        gigId,
        freelancerId: req.user._id,
        message,
        price,
    });

    const createdBid = await bid.save();
    res.status(201).json(createdBid);
};

// @desc    Get bids for a gig
// @route   GET /api/bids/:gigId
// @access  Private (Owner only)
const getBidsByGig = async (req, res) => {
    const gig = await Gig.findById(req.params.gigId);

    if (!gig) {
        res.status(404).json({ message: 'Gig not found' });
        return;
    }

    if (gig.ownerId.toString() !== req.user._id.toString()) {
        res.status(401).json({ message: 'Not authorized' });
        return;
    }

    const bids = await Bid.find({ gigId: req.params.gigId }).populate('freelancerId', 'name email');
    res.json(bids);
};

// @desc    Get user's bids
// @route   GET /api/bids/my
// @access  Private
const getMyBids = async (req, res) => {
    const bids = await Bid.find({ freelancerId: req.user._id })
        .populate('gigId', 'title status ownerId')
        .sort({ createdAt: -1 });
    res.json(bids);
};

// @desc    Hire a freelancer (Atomic Transaction)
// @route   PATCH /api/bids/:bidId/hire
// @access  Private (Owner only)
const hireFreelancer = async (req, res) => {
    let session;
    try {
        session = await mongoose.startSession();
    } catch (error) {
        return res.status(500).json({ message: 'Transactions not supported on this MongoDB instance (Replica Set required)' });
    }

    session.startTransaction();

    try {
        const bid = await Bid.findById(req.params.bidId).session(session);
        if (!bid) {
            await session.abortTransaction();
            session.endSession();
            res.status(404).json({ message: 'Bid not found' });
            return;
        }

        const gig = await Gig.findById(bid.gigId).session(session);
        if (!gig) {
            await session.abortTransaction();
            session.endSession();
            res.status(404).json({ message: 'Gig not found' });
            return;
        }

        if (gig.ownerId.toString() !== req.user._id.toString()) {
            await session.abortTransaction();
            session.endSession();
            res.status(401).json({ message: 'Not authorized' });
            return;
        }

        if (gig.status === 'assigned') {
            await session.abortTransaction();
            session.endSession();
            res.status(400).json({ message: 'Gig already assigned' });
            return;
        }

        // Atomic hiring
        gig.status = 'assigned';
        await gig.save({ session });

        bid.status = 'hired';
        await bid.save({ session });

        await Bid.updateMany(
            { gigId: gig._id, _id: { $ne: bid._id } },
            { status: 'rejected' },
            { session }
        );

        await session.commitTransaction();
        session.endSession();

        // Socket notification
        const io = req.app.get('socketio');
        if (io) {
            io.to(`user:${bid.freelancerId._id || bid.freelancerId}`).emit('notification', {
                message: `You have been hired for ${gig.title}!`,
                gigId: gig._id,
            });
        }

        res.json({ message: 'Freelancer hired successfully' });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error(error);
        res.status(500).json({ message: 'Transaction failed', error: error.message });
    }
};

module.exports = { placeBid, getBidsByGig, getMyBids, hireFreelancer };
