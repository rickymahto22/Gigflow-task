import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GigDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [gig, setGig] = useState(null);
    const [bids, setBids] = useState([]);

    // Bid Form state
    const [message, setMessage] = useState('');
    const [price, setPrice] = useState('');
    const [bidError, setBidError] = useState('');
    const [bidSuccess, setBidSuccess] = useState('');

    useEffect(() => {
        fetchGig();
    }, [id]);

    useEffect(() => {
        if (gig && user && user._id === gig.ownerId._id) {
            fetchBids();
        }
    }, [gig, user]);

    const fetchGig = async () => {
        try {
            const { data } = await axios.get(`/api/gigs/${id}`);
            setGig(data);
        } catch (err) { console.error(err); }
    };

    const fetchBids = async () => {
        try {
            const { data } = await axios.get(`/api/bids/${id}`);
            setBids(data);
        } catch (err) { console.error(err); }
    };

    const handlePlaceBid = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/bids', { gigId: id, message, price });
            setBidSuccess('Bid placed successfully!');
            setBidError('');
            setMessage('');
            setPrice('');
        } catch (err) {
            setBidError(err.response?.data?.message || 'Failed to place bid');
            setBidSuccess('');
        }
    };

    const handleHire = async (bidId) => {
        if (!confirm('Are you sure you want to hire this freelancer?')) return;
        try {
            await axios.patch(`/api/bids/${bidId}/hire`);
            alert('Freelancer hired!');
            fetchGig(); // Refresh status
            fetchBids(); // Refresh bids
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to hire');
        }
    };

    if (!gig) return <div className="text-center mt-10">Loading...</div>;

    const isOwner = user && gig.ownerId._id === user._id;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 mb-8">
                <div className="flex justify-between items-start mb-4">
                    <h1 className="text-3xl font-bold text-gray-900">{gig.title}</h1>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${gig.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {gig.status.toUpperCase()}
                    </span>
                </div>
                <p className="text-gray-500 mb-6">Posted by {gig.ownerId.name} • Budget: <span className="text-indigo-600 font-bold">${gig.budget}</span></p>
                <div className="prose max-w-none text-gray-700">
                    <p>{gig.description}</p>
                </div>
            </div>

            {/* Owner View: List Bids */}
            {isOwner && (
                <div>
                    <h2 className="text-2xl font-bold mb-4">Received Bids</h2>
                    <div className="space-y-4">
                        {bids.length === 0 ? <p className="text-gray-500">No bids yet.</p> : (
                            bids.map(bid => (
                                <div key={bid._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-lg">{bid.freelancerId.name}</h3>
                                        <p className="text-gray-600 mb-2">{bid.message}</p>
                                        <p className="font-semibold text-indigo-600">Bid Price: ${bid.price}</p>
                                        <p className="text-sm mt-1">Status: <span className={`font-semibold ${bid.status === 'hired' ? 'text-green-600' :
                                                bid.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'
                                            }`}>{bid.status.toUpperCase()}</span></p>
                                    </div>
                                    {gig.status === 'open' && bid.status === 'pending' && (
                                        <button
                                            onClick={() => handleHire(bid._id)}
                                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition shadow-sm"
                                        >
                                            Hire
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Freelancer View: Place Bid */}
            {!isOwner && user && gig.status === 'open' && (
                <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                    <h2 className="text-2xl font-bold mb-6">Place a Bid</h2>
                    {bidError && <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">{bidError}</div>}
                    {bidSuccess && <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4 text-sm">{bidSuccess}</div>}

                    <form onSubmit={handlePlaceBid} className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Proposal Message</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none h-24"
                                placeholder="Why are you a good fit?"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">Your Price ($)</label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                required
                            />
                        </div>
                        <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-md">
                            Submit Bid
                        </button>
                    </form>
                </div>
            )}

            {!user && (
                <div className="text-center mt-8">
                    <p className="text-gray-600">Please <a href="/login" className="text-indigo-600 font-bold">login</a> to bid on this gig.</p>
                </div>
            )}
        </div>
    );
};
export default GigDetails;
