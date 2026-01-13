import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('gigs'); // 'gigs' or 'bids'
    const [myGigs, setMyGigs] = useState([]);
    const [myBids, setMyBids] = useState([]);

    useEffect(() => {
        fetchMyGigs();
        fetchMyBids();
    }, []);

    const fetchMyGigs = async () => {
        try {
            const { data } = await axios.get('/api/gigs/my');
            setMyGigs(data);
        } catch (err) { console.error(err); }
    };

    const fetchMyBids = async () => {
        try {
            const { data } = await axios.get('/api/bids/my');
            setMyBids(data);
        } catch (err) { console.error(err); }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-900">Dashboard</h1>

            <div className="flex border-b border-gray-200 mb-8">
                <button
                    className={`py-2 px-4 font-medium transition-colors border-b-2 ${activeTab === 'gigs' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('gigs')}
                >
                    My Posted Gigs
                </button>
                <button
                    className={`ml-8 py-2 px-4 font-medium transition-colors border-b-2 ${activeTab === 'bids' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('bids')}
                >
                    My Bids
                </button>
            </div>

            {activeTab === 'gigs' && (
                <div className="space-y-4">
                    {myGigs.length === 0 ? <p className="text-gray-500">You haven't posted any gigs yet.</p> : (
                        myGigs.map(gig => (
                            <div key={gig._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{gig.title}</h3>
                                    <p className="text-gray-500 flex items-center gap-2 mt-1">
                                        Status:
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${gig.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {gig.status.toUpperCase()}
                                        </span>
                                    </p>
                                </div>
                                <Link to={`/gigs/${gig._id}`} className="text-indigo-600 hover:text-indigo-800 font-medium px-4 py-2 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition">
                                    Manage
                                </Link>
                            </div>
                        ))
                    )}
                </div>
            )}

            {activeTab === 'bids' && (
                <div className="space-y-4">
                    {myBids.length === 0 ? <p className="text-gray-500">You haven't placed any bids yet.</p> : (
                        myBids.map(bid => (
                            <div key={bid._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{bid.gigId?.title || 'Unknown Gig'}</h3>
                                    <div className="flex items-center gap-4 mt-1">
                                        <p className="text-gray-600">Your Bid: <span className="font-semibold">${bid.price}</span></p>
                                        <p className="flex items-center gap-2">
                                            Status:
                                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${bid.status === 'hired' ? 'bg-green-100 text-green-800' :
                                                    bid.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {bid.status.toUpperCase()}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <Link to={`/gigs/${bid.gigId?._id}`} className="text-indigo-600 hover:text-indigo-800 font-medium px-4 py-2 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition">
                                    View Gig
                                </Link>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};
export default Dashboard;
