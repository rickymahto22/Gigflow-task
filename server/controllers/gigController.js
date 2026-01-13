const Gig = require('../models/Gig');

// @desc    Get all open gigs
// @route   GET /api/gigs
// @access  Public
const getGigs = async (req, res) => {
    const keyword = req.query.search
        ? {
            title: {
                $regex: req.query.search,
                $options: 'i',
            },
        }
        : {};

    const gigs = await Gig.find({ ...keyword, status: 'open' })
        .populate('ownerId', 'name email')
        .sort({ createdAt: -1 });
    res.json(gigs);
};

// @desc    Get gig by ID
// @route   GET /api/gigs/:id
// @access  Public
const getGigById = async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.id).populate('ownerId', 'name email');
        if (gig) {
            res.json(gig);
        } else {
            res.status(404).json({ message: 'Gig not found' });
        }
    } catch (err) {
        res.status(404).json({ message: 'Gig not found' });
    }
};

// @desc    Create a gig
// @route   POST /api/gigs
// @access  Private
const createGig = async (req, res) => {
    const { title, description, budget } = req.body;

    const gig = new Gig({
        title,
        description,
        budget,
        ownerId: req.user._id,
    });

    const createdGig = await gig.save();
    res.status(201).json(createdGig);
};

// @desc    Get user's gigs
// @route   GET /api/gigs/my
// @access  Private
const getMyGigs = async (req, res) => {
    const gigs = await Gig.find({ ownerId: req.user._id }).sort({ createdAt: -1 });
    res.json(gigs);
};

module.exports = { getGigs, getGigById, createGig, getMyGigs };
